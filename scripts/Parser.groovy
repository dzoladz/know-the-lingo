@Grapes(
	@Grab(group='org.apache.poi', module='poi-ooxml', version='3.7')
)

import org.apache.poi.ss.usermodel.*
import org.apache.poi.hssf.usermodel.*
import org.apache.poi.xssf.usermodel.*
import org.apache.poi.ss.util.*
import org.apache.poi.ss.usermodel.*
import org.apache.poi.ss.usermodel.Workbook
import java.io.*

class Parser {

	def parse(path) {
		InputStream inp = new FileInputStream(path)
		Workbook wb = WorkbookFactory.create(inp);
		Sheet sheet = wb.getSheetAt(0);

		Iterator<Row> rowIt = sheet.rowIterator()
		Row row = rowIt.next()

		def rows = []
		while(rowIt.hasNext()) {
			row = rowIt.next()
			rows << getRowData(row)
		}
		[rows]
	}

	def getRowData(Row row) {
		def data = []
		for (Cell cell : row) {
			getValue(row, cell, data)
		}
		data
	}

	def getRowReference(Row row, Cell cell) {
		def rowIndex = row.getRowNum()
		def colIndex = cell.getColumnIndex()
		CellReference ref = new CellReference(rowIndex, colIndex)
		ref.getRichStringCellValue().getString()
	}

	def getValue(Row row, Cell cell, List data) {
		def rowIndex = row.getRowNum()
		def colIndex = cell.getColumnIndex()
		def value = ""
		switch (cell.getCellType()) {
			case Cell.CELL_TYPE_STRING:
				value = cell.getRichStringCellValue().getString();
				break;
			case Cell.CELL_TYPE_NUMERIC:
				if (DateUtil.isCellDateFormatted(cell)) {
					value = cell.getDateCellValue();
				} else {
					value = cell.getNumericCellValue();
				}
				break;
			case Cell.CELL_TYPE_BOOLEAN:
				value = cell.getBooleanCellValue();
				break;
			case Cell.CELL_TYPE_FORMULA:
				value = cell.getCellFormula();
				break;
			default:
				value = ""
		}
		data[colIndex] = value
		data
	}

	public static void main(String[]args) {
		def filename = 'LC_and_Dewey_Chart.xlsx'
		Parser parser = new Parser()
		def (rows) = parser.parse(filename)

		def out =jsonFormatter(rows)
		jsonOutputToFile(out)
	}

	private static jsonFormatter(rows) {
		def prevCategory = ""
		def currentCategory = ""
		def nextCategory = ""
		def rowString = ""
		def out = "{\n"
		out += "  \"lingo\": {\n"
		out += "     \"categories\": [ \n"
		rows.eachWithIndex {row, i ->
			currentCategory = row[0]
			if (currentCategory){
				prevCategory = currentCategory
				
				def categoryImg = imgCategoryStringCreator(currentCategory);
		
				out += "          {\"title\": \"${row[0]}\",\n              \"img\": \"${categoryImg}\",\n"
				out += "              \"subcategories\": [ \n"
			}

			rowString = rows[i].toString()
			if(!rowString.contains("null")){
				out += "                      { \"title\": \"${row[1]}\", \"ddc\": \"${row[2]}\", \"lcc\": \"${row[3]}\" },\n"
			}

			nextCategory = rows[i+1]?rows[i+1][0]:""
			if (nextCategory && !nextCategory.equals(prevCategory)){
				out = removeLastCommaOutOfArray(out)
				out += "              ] \n "
				out +=  "          }, \n"
				prevCategory = ""
				nextCategory = ""
			}
		}

		out = removeLastCommaOutOfArray(out)
		out += "              ] \n "
		out +=  "          } \n"
		out +=  "   ]\n"
		out +=  "  }\n"
		out +=  "}\n"
	}

	private static String imgCategoryStringCreator(String currentCategory) {
		return currentCategory.toLowerCase().replaceAll(/ & | /,"_")+".png"
	}

	private static String removeLastCommaOutOfArray(out) {
		out = out[0..-3]
		out += "\n "
		return out
	}

	private static File jsonOutputToFile(out) {
		def file = new File('lingo.json')
		file.write(out)
	}

}
