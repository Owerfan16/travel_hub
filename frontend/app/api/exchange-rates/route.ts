import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// Функция для получения текущих курсов валют с сайта ЦБ РФ
export async function GET() {
  try {
    // Получаем текущую дату в формате dd/mm/yyyy для запроса к API ЦБ РФ
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    // URL API Центробанка с указанием текущей даты
    const url = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${dateStr}`;

    // Запрашиваем данные
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ошибка при получении курсов валют: ${response.status}`);
    }

    // Получаем XML с курсами валют
    const xmlData = await response.text();

    // Парсим XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsedData = parser.parse(xmlData);

    // Проверяем, есть ли нужные данные в ответе
    if (!parsedData.ValCurs || !parsedData.ValCurs.Valute) {
      throw new Error("Неверный формат данных от API ЦБ РФ");
    }

    // Находим нужные валюты (доллар США и китайский юань)
    const currencies = parsedData.ValCurs.Valute;
    let USD = 0;
    let CNY = 0;

    // Ищем курсы валют в массиве
    for (const currency of currencies) {
      // Доллар США (ID = R01235)
      if (currency["@_ID"] === "R01235") {
        // Заменяем запятую на точку и преобразуем в число
        USD = parseFloat(currency.Value.replace(",", "."));
      }
      // Китайский юань (ID = R01375)
      else if (currency["@_ID"] === "R01375") {
        // Заменяем запятую на точку и преобразуем в число
        CNY = parseFloat(currency.Value.replace(",", "."));
      }
    }

    // Если не удалось найти курсы, выбрасываем ошибку
    if (!USD || !CNY) {
      throw new Error("Не удалось найти курсы валют в ответе API");
    }

    // Возвращаем найденные курсы
    return NextResponse.json({
      USD,
      CNY,
      lastUpdated: today.toISOString(),
    });
  } catch (error) {
    console.error("Ошибка при получении курсов валют:", error);

    // Возвращаем ошибку с кодом 500
    return NextResponse.json(
      {
        error: "Не удалось получить курсы валют",
        details: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 }
    );
  }
}
