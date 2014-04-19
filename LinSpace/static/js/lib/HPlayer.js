var $playerDom = $("<div id='HPlayer_main'><video id='hPlayer'><source/></video></div>");
var $playControl = $("<div id='playControl'><div id='pause'><div id='pause_ico'></div></div>" +
    "<div id='videoTime'><div id='startTime'>00:00:00</div><div id='timeSplit'>/</div>" +
    "<div id='endTime'>00:00:00</div></div>" +
    "<div id='process'><div id='process_past'><div id='process_ico'></div></div></div>" +
    "<div id='vol'><div id='vol_ico'></div>" +
    "<div id='vol_process'><div id='vol_process_past'><div id='vol_process_ico'></div></div></div></div>" +
    "<div id='full'><div id='full_ico'></div></div></div>");

var defarltSetting = {
    width: 500,
    autoplay: false,
    preload: false,
    controls: false,
    volume: 0.5
};

var HPlayer = function(type, $dom){
    var self = this;
    this.player = $playerDom.find("#hPlayer").get(0);
    this.playerDOM = $playerDom.find("#hPlayer");
    this.playControl = $playControl;
    $playControl.appendTo($playerDom);
    $playerDom.find("source").attr("type", type);
    $playerDom.appendTo($dom);
};

HPlayer.prototype._initHPlayer = function(param, playurl){
    var settings = $.extend(defarltSetting, param);
    for(var item in settings){
        this.playerDOM.attr(item, param[item]);
    }
    $playerDom.css("width", settings.width + "px");
    //存储音量设置到本地
//    $.cookie("volume", this.playerDOM.attr("volume"));
    window.localStorage.setItem("volume", this.playerDOM.attr("volume"));
    this.playerDOM.find("source").attr("src", playurl);
    this._bindEvent();
};

HPlayer.prototype._bindEvent = function(){
    var self = this;
    //视频加载完成，初始化播控页面元素
    this.playerDOM.on("loadedmetadata", function(){
        self._initPlayControl();
    });

    this.playerDOM.on("mouseover", function(){
        self.playControl.css("visibility", "visible");
    }).on("mouseout", function(){
            self.playControl.css("visibility", "hidden");
        });

    this.playControl.on("mouseover", function(){
        self.playControl.css("visibility", "visible");
    }).on("mouseout", function(){
            self.playControl.css("visibility", "hidden");
        });

    //绑定全局事件
    $( document ).bind(
        'fullscreenchange webkitfullscreenchange mozfullscreenchange',
        function(){
            var totalProcessLength = self._getProcessLength();
            var currentTime = self.getCurrentTime();
            var totalTime = self.getTotalTime();
            var currentProcessLength = (currentTime / totalTime) * totalProcessLength;
            if(self.isFullScreen()){
                //全屏状态
                //设置进度条长度
                self.playControl.find("#process_past").css("width", currentProcessLength + "px");

                //鼠标10s不动自动隐藏播控
                var moveFlag = false;

                var hideProcess = function(){
                    if(!moveFlag){
                        moveFlag = false;
                        self.playControl.css("visibility", "hidden");
                    }else{
                        moveFlag = false;
                    }
                    clearTimeout(self.mouseTimer);
                    self.mouseTimer = setTimeout(hideProcess, 10000);
                };

                $(document).unbind("mousemove").on("mousemove", function(){
                    moveFlag = true;
                    self.playControl.css("visibility", "visible");
                });
                self.playerDOM.unbind("mouseover").on("mouseover", function(e){
                    hideProcess();
                });

            }else{
                //非全屏状态
                //设置进度条长度
                self.playControl.find("#process_past").css("width", currentProcessLength + "px");

                $(document).unbind("mousemove");
                clearTimeout(self.mouseTimer);
                self.playerDOM.unbind("mouseover").on("mouseover", function(){
                    self.playControl.css("visibility", "visible");
                }).on("mouseout", function(){
                        self.playControl.css("visibility", "hidden");
                    });
            }
        }
    );

    this.playerDOM.on("play", function(){
        self.playControl.find("#pause").removeClass().addClass("playing");
        //展示进度条
        self._showProcess();
    });

    this.playerDOM.on("pause", function(){
        self.playControl.find("#pause").removeClass().addClass("paused");
        self._cancelProcess();
    });

    this.playerDOM.on("click", function(){
        self.playPause();
    });

    this.playerDOM.on("dblclick", function(){
        self.fullScreen();
    });

    this.playControl.find("#pause").on("click", function(e){
        self.playPause();
    });

    this.playControl.find("#process_ico").on("mousedown", function(e){
        self._dragProcess(e, $(this));
    });

    this.playControl.find("#vol_ico").on("click", function(e){
        self.setMute(e, $(this));
    });

    this.playControl.find("#vol_process_ico").on("mousedown", function(e){
        self._dragVolProcess(e, $(this));
    });

    this.playControl.find("#full").on("click", function(){
        self.fullScreen();
    });
};

HPlayer.prototype._initPlayControl = function(){
    this.playControl.find("#pause").removeClass().addClass("paused");
    var $endTime = this.playControl.find("#endTime");
    var totalTime = this.parseTime(this.getTotalTime());
    $endTime.text(totalTime);
    //音量展示
    var localStoreVolume= window.localStorage.getItem("volume");
    var currentVolume = this.player.volume;
    if(localStoreVolume){
        currentVolume = localStoreVolume;
    }
    currentVolume = currentVolume > 1 ? 1: currentVolume;
    var $currentVolProcess = this.playControl.find("#vol_process_past");
    var currentVolLength = this._getVolProcessLength() * currentVolume;
    $currentVolProcess.css("width", currentVolLength + "px");
};

HPlayer.prototype._showProcess = function(){
    var self = this;
    var totalProcessLength = this._getProcessLength();
    var currentTime = this.getCurrentTime();
    var totalTime = this.getTotalTime();
    var currentProcessLength = (currentTime / totalTime) * totalProcessLength;
    this.playControl.find("#process_past").css("width", currentProcessLength + "px");
    this.playControl.find("#startTime").text(this.parseTime(currentTime));
    this.playProcessTimer = setTimeout(function(){
        self._showProcess();
    },1000)
};

HPlayer.prototype._cancelProcess = function(){
    if(this.playProcessTimer){
        clearTimeout(this.playProcessTimer);
    }
};

HPlayer.prototype._dragProcess = function(e,$ele){
    var self = this;
    var dragEnd = false;
    var _move = true;
    var $currentProcess = this.playControl.find("#process_past");
    $ele.fadeTo(20, 0.5);
    $(document).on("mousemove", function(e1){
        if(!dragEnd && _move){
            self.player.pause();
            var x = e1.pageX - e.pageX;//偏移量
            e.pageX = e1.pageX;
            if( $currentProcess.width() < self._getProcessLength()){
                $currentProcess.css("width", $currentProcess.width() + x);
            }else if(x < 0){
                $currentProcess.css("width", $currentProcess.width() + x);
            }
        }
    });
    $(document).on("mouseup", function(){
        if(!dragEnd){
            dragEnd = true;
            _move = false;
            $ele.fadeTo(20, 1);
            //播放当前位置
            var currentTime = parseInt($currentProcess.width()/self._getProcessLength() * self.getTotalTime());
            self.playTime(currentTime);
        }
    });
};

HPlayer.prototype._dragVolProcess = function(e,$ele){
    var self = this;
    var dragEnd = false;
    var _move = true;
    var $currentProcess = this.playControl.find("#vol_process_past");
    $ele.fadeTo(20, 0.5);
    $(document).on("mousemove", function(e1){
        if(!dragEnd && _move){
            var x = e1.pageX - e.pageX;//偏移量
            e.pageX = e1.pageX;
            if( $currentProcess.width() < self._getVolProcessLength()){
                $currentProcess.css("width", $currentProcess.width() + x + "px");
            }else if(x < 0){
                $currentProcess.css("width", $currentProcess.width() + x + "px");
            }
        }
    });
    $(document).on("mouseup", function(){
        if(!dragEnd){
            dragEnd = true;
            _move = false;
            $ele.fadeTo(20, 1);
            //播放当前位置
            var currentVolume = Math.round($currentProcess.width()/self._getVolProcessLength() * 100)/100;
            self.player.volume = currentVolume;
        }
    });
};

HPlayer.prototype._getProcessLength = function(){
    return this.playControl.find("#process").width() - this.playControl.find("#process_ico").width() +
        (this.playControl.find("#process_ico").width() + parseInt(this.playControl.find("#process_ico").css("right")));
};

HPlayer.prototype._getVolProcessLength = function(){
    return this.playControl.find("#vol_process").width() - this.playControl.find("#vol_process_ico").width() +
        (this.playControl.find("#vol_process_ico").width() + parseInt(this.playControl.find("#vol_process_ico").css("right")));
};

HPlayer.prototype.playPause = function(){
    if(this.player.paused){
        this.player.play();
    }else{
        this.player.pause();
    }
};

HPlayer.prototype.playTime = function(time){
    console.log(this.player.seekable);
    this.setCurrentTime(time);
    this.player.play();
};

HPlayer.prototype.setMute = function(e, $ele){
    var currentVolume = window.localStorage.getItem("volume");
    if(this.player.muted){
        this.playerDOM.prop("muted", false);
        //TODO 变为非静音图标
    }else{
        //TODO 变为静音图标
        this.playerDOM.prop("muted", true);
    }
};

HPlayer.prototype.isFullScreen = function(){
    return (document.fullscreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        false)
};

HPlayer.prototype.fullScreen = function(){
    //判断是否处于全屏状态
    var self = this;
    if(this.isFullScreen()){
        //是则退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }else{
        //否则全屏
        if(this.playerDOM.parent().get(0).webkitRequestFullScreen){
            this.playerDOM.parent().get(0).webkitRequestFullScreen();
        }else if(this.playerDOM.parent().get(0).mozRequestFullScreen){
            this.playerDOM.parent().get(0).mozRequestFullScreen();
        }else if(this.playerDOM.parent().get(0).requestFullscreen){
            this.playerDOM.parent().get(0).requestFullscreen();
        }

    }
};

HPlayer.prototype.getCurrentTime = function(){
    return this.player.currentTime;
};

HPlayer.prototype.setCurrentTime = function(time){
    this.player.currentTime = time;
};

HPlayer.prototype.getTotalTime = function(){
    return this.player.duration;
};

HPlayer.prototype.parseTime = function(time){
    var hour = parseInt(time / 3600).toString();
    var minute = parseInt((time % 3600) / 60).toString();
    var second = (parseInt((time % 3600) % 60)).toString();
    return (parseInt(hour) >= 10 ? hour : "0"+""+hour) + ":" +
        (parseInt(minute) >= 10 ? minute : "0"+""+minute) + ":" +
        (parseInt(second) >= 10 ? second : "0"+""+second);
};
