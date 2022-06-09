// pages/component/tt.
// 引用https://blog.csdn.net/move_code/article/details/122034381代码和样式
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function() {
      this.initCalendar();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    today: 0,
    week: ["一", "二", "三", "四", "五", "六", "日"],//星期
    maxDayList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],//一年12个月，每个月的天数，初始化都给平年
    nowYear: new Date().getFullYear(),//当前年份
    nowMonth: new Date().getMonth()+1,//当前月份
    totalDay: [],//日历天数
    choise: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
  
    /**
     * 初始化日历
     */
    initCalendar() {
      let maxDayList = this.data.maxDayList;
      let year = this.data.nowYear, month = this.data.nowMonth;
      if((year%4 == 0 && year%100 != 0) || year%400 == 0) {//计算当前年是不是闰年，规则：能被4整除且不被100整除，或者能被400整除的年份
        maxDayList[1] = 29;//2月份29天
      }else {//平年
        maxDayList[1] = 28;//2月份28天
      }
      this.setData({maxDayList});
      let firstDayWeek = new Date(year + "-" + month + "-1").getDay() ;//当前月的1号是星期几
      firstDayWeek = firstDayWeek > 0 ? firstDayWeek : 7;//星期日从0转成7
      let endDayWeek = new Date(year + "-" + month + "-" +maxDayList[month - 1]).getDay();//当前月最后一天是星期几
      endDayWeek = endDayWeek > 0 ? endDayWeek : 7;//星期日从0转成7
      let beforArr = [], afterArr = [];//beforArr：本月1号之前需要补充上个月月尾几天，afterArr：本月尾补充下个月月初几天
      //求出补充的上个月的日子
      for(let i=0; i<firstDayWeek-1; i++) {//找出1号之前的空缺上个月的尾数日,比如今天是周三，则i=3-1, 取前两天的日子
        beforArr[i] = {otherMonth: true, day: ''};//从对应月份的尾数天开始存，比如31，30，29... 
      }
      beforArr = beforArr.reverse();//将补的上月的日子翻转
      //求出补充的下个月的日子
      for(let i=0; i<7-endDayWeek; i++) {//找出月尾对应的星期几，看看到周日还差几天就从下个月月初补几天
        afterArr[i] = {otherMonth: true, day: ''};
      }
      let nowMonthArr = [];//当前月所有日子
      for(let i=0; i<maxDayList[month - 1]; i++) {
        nowMonthArr[i] = {day: i+1, sele: false};
        if(year == new Date().getFullYear()) {//如果切换到了本年本月本日，则凸显今日
          if(month == new Date().getMonth() + 1) {
            if(new Date().getDate() == i+1) {
              nowMonthArr[i].today = true;
              this.setData({
                today: nowMonthArr[i].day
              })
            }
          }
        }
      }
      let totalDayList = beforArr.concat(nowMonthArr).concat(afterArr);//将所有日期拼接
      let totalDay = [], arr = [];//totalDay:最终用来展示数据，arr：用来分割每一周的日子
      for(let i=0; i<totalDayList.length; i++) {
        arr.push(totalDayList[i]);
        if((i+1)%7 == 0) {//每7天存为一组
          totalDay.push(arr);
          arr = [];//存完清空
        }
      }
      this.setData({totalDay});
    },
    sele(e){
      let x = e.currentTarget.dataset.x;
      let y = e.currentTarget.dataset.y;
      let totalDay = this.data.totalDay;
      if(totalDay[x][y].day <= this.data.today) {
        return
      }
      totalDay[x][y].sele = !totalDay[x][y].sele;
      this.setData({
        totalDay
      })
    },
    chose() {
      let arr = [];
      this.data.totalDay.forEach((each)=>{
        each.forEach(e=>{
          if(e.sele) {
            arr.push(this.data.nowYear+'年-'+this.data.nowMonth+'月-'+e.day+'日')
          }
        })
      })
      this.triggerEvent('choise' , arr)
    }
  }
})
