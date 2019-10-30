
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const phantom=require('node-phantom-simple');
const AbstractService = require('./AbstractService');

ChartGenerator.prototype = new AbstractService();

function ChartGenerator()
{
    const self = this;
    const file = `${moment().unix()}.png`;
    //const file = `./static/${moment().unix()}.jpg`;
    //const url = `https://tvc4.forexpros.com/95d6a9cc0ff8befa6108ab62f2caa1a5/1571638960/70/70/31/history?symbol=625&resolution=5&from=${moment().subtract(3, 'day').unix()}&to=${moment().unix()}`;
    const url = `https://au.advfn.com/common/javascript/tradingview/advfn/history?symbol=ASX%5EXJO&resolution=5&from=${moment().subtract(3, 'day').unix()}&to=${moment().unix()}`;
    let chartData = {};

    this.init = function(){
        return new Promise(function(resolve, reject) {
            axios.get(url).then(function(data) {

                    const body = data.data;

                    let chartData = {
                        dataCandlestick: [],
                        dataBar: [],
                        min:Math.min(...[Math.min(...body.o), Math.min(...body.h), Math.min(...body.l), Math.min(...body.c)]),
                        max:Math.max(...[Math.min(...body.o), Math.max(...body.h), Math.max(...body.l), Math.max(...body.c)])
                    };
                    let formatNow = moment().format('l');

                    //for (let i = body.t.length; i>=0; i--) {
                    for (let i = 0, с = body.t.length; i<с; i++) {

                        let date = moment.unix( body.t[i] );
                        let dateFormatted = date.format(  formatNow == date.format('l') ? 'LT' : 'MM/DD h:mm a'  );

                        chartData.dataCandlestick.unshift({
                            x: dateFormatted,
                            y: [body.o[i], body.h[i], body.l[i], body.c[i]]
                        });

                        chartData.dataBar.unshift({
                            x: dateFormatted,
                            y: body.v[i]
                        })
                    }

                phantom.create(function(err,ph) {
                    if (err) {
                        reject({text:'Phantom Create Error', err:err});
                        return null;
                    }

                    return ph.createPage(function(err,page) {
                        if (err) {
                            reject({text:'Ph CreatePage Error', err:err});
                            return null;
                        }

                        page.set('settings.viewportSize', { width: 1024, height: 600 });
                        page.onConsoleMessage = function (msg, line, source) {
                            console.log('Phantom Console Message >', msg);
                        };

                        page.open(`http://localhost:${process.env.HTTP_BACKEND_PORT}/cba-chart.html`, function(err,status) {
                            if (err) {
                                reject({text:'Page Open Error', err:err});
                                return null;
                            }

                            page.evaluateJavaScript(`initChart(${JSON.stringify(chartData)})`);
                            setTimeout(function(){
                                page.render(process.env.HTTP_STATIC_PATH+file, {quality: '75', format: 'PNG'}, function(a,b) {
                                    ph.exit();
                                    resolve();
                                });
                            }, 500);
                        });
                    });
                });
            })
            .catch(function(err){
                reject({text:'forexpros.com Error', err:err});
            });
        });
    };

    this.getImageUrl = function(){
        return process.env.HTTP_STATIC_URL+file;
    }


}

module.exports = ChartGenerator;
