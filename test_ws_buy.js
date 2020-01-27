const WebSocket = require('ws');
var reduce = false
async function buy(param_credentials, param_size, param_strat) {
    if (param_strat == "Short") {
        reduce = true;
    }
    var msg_auth =
    {
        "jsonrpc": "2.0",
        "id": 9929,
        "method": "public/auth",
        "params": {
            "grant_type": "client_credentials",
            "client_id": param_credentials.client_id,
            "client_secret": param_credentials.client_secret
        }
    };
    var msg_order =
    {
        "jsonrpc": "2.0",
        "id": 5275,
        "method": "private/buy",
        "params": {
            "instrument_name": "BTC-PERPETUAL",
            "amount": param_size,
            "type": "market",
            "label": "market0000235",
            "reduce_only": reduce
        }
    };
    var ws = new WebSocket('wss://test.deribit.com/ws/api/v2');

    var output = []


    ws.onopen = async function () {
        console.log("Opening/Authenicating Websocket..");
        auth = ws.send(JSON.stringify(msg_auth));
        await auth
        console.log("Order via Websocket..");
        ws.send(JSON.stringify(msg_order));

        ws.onmessage = async function (msg) {
            // console.log('Wait for ws.onopen response message');
            // console.log('received from server : ', msg.data);
            response = JSON.parse(msg.data);
            var id = await response.id;

            if (id == msg_auth.id) {
                var token = response.result.token_type;
                // console.log(response.result)
                output.push(token)
            }
            else if (id == msg_order.id) {
                if (response.result) {
                    var exec = response.result;
                    exec.trades.forEach(function (trade) {
                        console.log("TradeID: ", trade.trade_id, " | Status: ", trade.state);
                        output.push(trade.trade_id, trade.state)
                    })
                } else {
                    console.log("Order Error!");
                    console.log(response.error);
                } 
            }
            console.log("Closing Websocket")
            // console.log(output);
            ws.close()
            return output

        };

    };
}

module.exports = { buy }

