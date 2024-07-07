const boton = document.getElementById("boton")
const montoInput = document.getElementById("monto")
const SeleccionMoneda = document.getElementById("currencyType")
const resultadoConversion = document.getElementById("result")
const ctx = document.getElementById('myChart').getContext('2d');

let myChart;

boton.addEventListener("click", async function moneda(){
    try{
        const monto = parseInt(montoInput.value)
        const currencyType = SeleccionMoneda.value


        const res= await fetch("https://mindicador.cl/api/")
        const data = await res.json()
        console.log(data)


        let conversion
        switch (currencyType){
            case "dolar":
                conversion= data.dolar.valor;
                break;
            case "uf":
                conversion= data.uf.valor;
                break;
            case "euro":
                conversion= data.euro.valor;
                break;
        }


        const resultado = (monto/conversion)
        resultadoConversion.innerHTML = `Resultado: ${resultado.toFixed(2)}`

        const historicalData = await last10(currencyType);
        graficaMonedas(historicalData, currencyType);
    }catch(error){
        alert(error.message)

    } }
)

async function last10(currencyType){
    const res=await fetch(`https://mindicador.cl/api/${currencyType}`)
    const data= await res.json()
    return data.serie.slice(0,10).reverse()
    
}
function graficaMonedas (monedas, currencyType){
    
    const nombreMoneda = currencyType.toUpperCase();
    const tipoDeGrafica = "line"
    const titulo = `10 ultimos valores de ${nombreMoneda}`;
    const colorDeLinea = "red";
    const valores = monedas.map((moneda) => moneda.valor);
    const fechas = monedas.map((moneda) => moneda.fecha.slice(0, 10));

    const config = {
        type: tipoDeGrafica,
        data: {
            labels: fechas,
            datasets: [{
                label: titulo,
                backgroundColor: colorDeLinea,
                data: valores.reverse(),
            }]
        },
    };

    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, config);
}




 