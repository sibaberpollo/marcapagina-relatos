import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Constantes
const AUTHORS_TO_SCRAPE = ['jose-pino'];
const BASE_URL = 'https://elestimulo.com';
const JSON_PATH = path.join(process.cwd(), 'data', 'external-articles.json');

// Interfaces para tipar correctamente
interface Article {
  id: string;
  title: string;
  url: string;
  image: string;
  summary: string;
  category: string;
  date: string;
  source: string;
}

interface AuthorData {
  lastUpdated: string;
  articles: Article[];
}

interface JsonData {
  authors: {
    [key: string]: AuthorData;
  };
}

// Función para leer el archivo JSON
function readJsonFile(): JsonData {
  try {
    const fileContent = fs.readFileSync(JSON_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error leyendo el archivo JSON:', error);
    return { authors: {} };
  }
}

// Función para escribir en el archivo JSON
function writeJsonFile(data: JsonData): boolean {
  try {
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error escribiendo el archivo JSON:', error);
    return false;
  }
}

// Función para escrapear artículos de un autor
async function scrapeAuthorArticles(authorSlug: string): Promise<Article[]> {
  try {
    // Obtener el HTML de la página del autor
    const response = await fetch(`${BASE_URL}/autor/${authorSlug}/`);
    if (!response.ok) {
      throw new Error(`Error obteniendo la página del autor: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Extraer los artículos del HTML usando regex
    // Nota: En producción es mejor usar un parser HTML como cheerio
    const articles: Article[] = [];
    
    // Patrón para detectar artículos
    const articlePattern = /<article[^>]*?class="ele-article[^>]*?>([\s\S]*?)<\/article>/g;
    let articleMatch;
    
    while ((articleMatch = articlePattern.exec(html)) !== null) {
      const articleHtml = articleMatch[0];
      
      // Extraer ID
      const idMatch = articleHtml.match(/data-id="(\d+)"/);
      const id = idMatch ? idMatch[1] : '';
      
      // Determinar si es Urbe Bikini o El Estímulo
      const isUrbeBikini = articleHtml.includes('ele-article--ele_ub');
      
      // Extraer URL e imagen
      const urlMatch = articleHtml.match(/href="(https:\/\/elestimulo\.com\/[^"]+)"/);
      const url = urlMatch ? urlMatch[1] : '';
      
      const imageMatch = articleHtml.match(/src="(https:\/\/media\.elestimulo\.com\/[^"]+)"/);
      const image = imageMatch ? imageMatch[1] : '';
      
      // Extraer título
      const titleMatch = articleHtml.match(/<h2[^>]*?class="ele-article__content__title"[^>]*?><a[^>]*?>(.*?)<\/a><\/h2>/);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : '';
      
      // Extraer resumen
      const summaryMatch = articleHtml.match(/<p[^>]*?class="ele-article__content__excerpt"[^>]*?>(.*?)<\/p>/);
      const summary = summaryMatch ? summaryMatch[1].trim() : '';
      
      // Extraer categoría
      const categoryMatch = articleHtml.match(/<a[^>]*?class="ele-article__content__category"[^>]*?>(.*?)<\/a>/);
      const category = categoryMatch ? categoryMatch[1] : '';
      
      // Extraer fecha
      const dateMatch = articleHtml.match(/datetime="(\d+)">(.*?)<\/time>/);
      const timestamp = dateMatch ? parseInt(dateMatch[1]) * 1000 : Date.now();
      const date = new Date(timestamp).toISOString();
      
      // Determinar la fuente
      const source = isUrbeBikini || (url && url.includes('/ub/')) ? 'Urbe Bikini' : 'El Estímulo';
      
      if (id && title && url) {
        articles.push({
          id,
          title,
          url,
          image,
          summary,
          category,
          date,
          source
        });
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`Error escrapeando artículos de ${authorSlug}:`, error);
    return [];
  }
}

// Endpoint GET para actualizar los artículos
export async function GET() {
  try {
    // Leer el archivo JSON existente
    const jsonData = readJsonFile();
    
    // Para cada autor a escrapear
    for (const authorSlug of AUTHORS_TO_SCRAPE) {
      // Convertir el slug a la clave que usamos en el JSON
      const authorKey = authorSlug.replace('jose-', '');
      
      // Escrapear los artículos
      const articles = await scrapeAuthorArticles(authorSlug);
      
      if (articles.length > 0) {
        // Actualizar el JSON con los nuevos artículos
        if (!jsonData.authors[authorKey]) {
          jsonData.authors[authorKey] = {
            lastUpdated: new Date().toISOString(),
            articles: []
          };
        }
        
        // Actualizar los artículos y la fecha
        jsonData.authors[authorKey].articles = articles;
        jsonData.authors[authorKey].lastUpdated = new Date().toISOString();
        
        // Guardar el JSON actualizado
        writeJsonFile(jsonData);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Artículos externos actualizados correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error actualizando artículos externos:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error actualizando artículos externos',
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 