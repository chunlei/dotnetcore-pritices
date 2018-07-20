var vm = new Vue({
    el: "#app",
    data: {
        messageList: "",
        websocket: null
    },
    methods: {
        openWebSocket: function () {
            var isSupport = 'WebSocket' in window;
            if (!isSupport) {
                var message = self.formatMessage(new Date(), "系统消息", "当前浏览器不支持WebSocket");
                self.messageList = self.messageList == null ? message : self.messageList + "<br/>" + message;
                return;
            }

            this.websocket = new WebSocket("ws://localhost:8002/push");
            let self = this;

            //链接错误得回调方法
            this.websocket.onerror = function () {
                var message = self.formatMessage(new Date(), "系统消息", "WebSocket连接发生错误");
                self.messageList = self.messageList == null ? message : self.messageList + "<br/>" + message;
            };

            //连接成功建立的回调方法
            this.websocket.onopen = function () {
                var message = self.formatMessage(new Date(), "系统消息", "WebSocket连接成功");
                self.messageList = self.messageList == null ? message : self.messageList + "<br/>" + message;
            }

            //接收到消息的回调方法
            this.websocket.onmessage = function (event) {
                var message = event.data
                self.messageList = self.messageList == null ? message : self.messageList + "<br/>" + message;
            }

            //连接关闭的回调方法
            this.websocket.onclose = function () {
                var message = self.formatMessage(new Date(), "系统消息", "WebSocket连接关闭");
                self.messageList = self.messageList == null ? message : self.messageList + "<br/>" + message;
            }

            //监听窗口关闭事件
            window.onbeforeunload = function () {
                if (self.websocket == null) {
                    reurn;
                }

                self.closeWebSocket();
            }
        },

        closeWebSocket: function () {
            if (this.websocket == null) {
                reurn;
            }

            this.sendEvent("Leaved");
            this.websocket.close();
        },

        formatMessage: function (sendTime, sender, message) {
            return moment(sendTime).format("YYYY-MM-DD hh:mm:ss") + " - " + sender + " : " + message;
        },

        clearMessageList: function () {
            this.messageList = null;
        }
    }
});