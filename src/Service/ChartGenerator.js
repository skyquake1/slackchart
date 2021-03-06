
const axios = require('axios');
//const moment = require('moment');
const moment = require('moment-timezone');
const fs = require('fs');
const phantom=require('node-phantom-simple');
const AbstractService = require('./AbstractService');

ChartGenerator.prototype = new AbstractService();

function ChartGenerator(code)
{
    code = (code || '').toUpperCase();
    const self = this;
    const file = `${moment().unix()}.png`;
    //const url = `https://tvc4.forexpros.com/95d6a9cc0ff8befa6108ab62f2caa1a5/1571638960/70/70/31/history?symbol=625&resolution=5&from=${moment().subtract(3, 'day').unix()}&to=${moment().unix()}`;
    //const url = `https://au.advfn.com/common/javascript/tradingview/advfn/history?symbol=ASX%5E${code}&resolution=5&v=1&from=${moment().startOf('day').subtract(1, 'hour').unix()}&to=${moment().add(1, 'day').tz('Australia/Sydney').unix()}`;
    const url = `https://au.advfn.com/common/javascript/tradingview/advfn/history?symbol=ASX%5E${code}&resolution=5&v=1&from=${moment().subtract(2, 'day').unix()}&to=${moment().add(1, 'day').tz('Australia/Sydney').unix()}`;
    let chartData = {};

    this.init = function(){
        return new Promise(function(resolve, reject) {
            axios.get(url).then(function(data) {
                    const body = data.data;
                    if ('no_data' == body.s) {
                        resolve({msg:"Data doesn't exists"});
                        return null;
                    }

                    let chartData = {
                        code: code,
                        dataCandlestick: [],
                        dataBar: [],
                        min:0,
                        max:0,
                        prevDay:{ts:0},
                    };
                    //let formatNow = moment().format('l');
                    let formatNow = moment().tz('Australia/Sydney').format('l');

                    //for (let i = body.t.length; i>=0; i--) {
                    for (let i = 0, с = body.t.length; i<с; i++) {
                        let date = moment.unix( body.t[i] ).tz('Australia/Sydney');
                        let dateFormatted = date.tz('Australia/Sydney').format(  formatNow == date.format('l') ? 'LT' : 'MM/DD h:mm a'  );

                        if (formatNow != date.tz('Australia/Sydney').subtract(1, 'hour').format('l')) {
                            if (chartData.prevDay.ts < body.t[i]) {
                                chartData.prevDay = {
                                    date:dateFormatted,
                                    price:body.c[i],
                                    ts:body.t[i]
                                };
                            }
                            continue;
                        }

                        const min = Math.min(...[body.o[i], body.h[i], body.l[i], body.c[i]]);
                        const max = Math.max(...[body.o[i], body.h[i], body.l[i], body.c[i]]);

                        if (chartData.min > min || !chartData.min) {
                            chartData.min = min
                        }

                        if (chartData.max < max) {
                            chartData.max = max
                        }

                        let dateFormattedX = dateFormatted.indexOf(':00')>=0 || dateFormatted.indexOf(':30')>=0 ? dateFormatted.toUpperCase() : '';

                        chartData.dataCandlestick.unshift({
                            //x: dateFormatted,
                            x: dateFormattedX,
                            y: [body.o[i], body.h[i], body.l[i], body.c[i]]
                        });

                        chartData.dataBar.unshift({
                            x: dateFormattedX,
                            y: body.v[i]
                        })
                    }

                for (let i = 0; i<=5; i++) {
                    chartData.dataCandlestick.unshift({
                        x: '',
                        y: [0,0,0,0]
                    });
                    chartData.dataBar.unshift({
                        x: '',
                        y: 0
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
                                    resolve(chartData);
                                });
                            }, 500);
                        });
                    });
                });
            })
            .catch(function(err){
                //reject({text:'forexpros.com Error', err:err});
                reject();
            });
        });
    };

    this.getImageUrl = function(){
        return process.env.HTTP_STATIC_URL+file;
    }
}

module.exports = ChartGenerator;
