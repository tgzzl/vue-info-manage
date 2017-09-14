<template>
  <popup-picker :data="list" :title="title" :display-format="cellFormat" v-model="currentValue"
                :inline-desc="inlineDesc" :placeholder="placeholder" @on-hide="emitHide" @on-show="$emit('on-show')"
                :value-text-align="valueTextAlign" :column-width="[1/2, 1/6]"
                :show-cell="showCell" :show="show">
  </popup-picker>
</template>

<script>
  /**
   * 时间范围选择组件
   * 开始时间取[value, 当前时间]最小者
   * 结束时间为当前时间的下个自然月
   * 分钟指定步长为30分钟
   */
  import {PopupPicker} from 'vux'
  import getDateRange from '../../node_modules/vux/src/tools/date/range'
  import getNumberRange from '../../node_modules/vux/src/tools/number/range'
  import {dateFormat} from '../util/utils'

  export default {
    components: {PopupPicker},
    props: {
      title: String,
      value: String,
      sdate: String,
      format: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      rawValue: Boolean,
      inlineDesc: String,
      placeholder: String,
      hideDistrict: Boolean,
      valueTextAlign: String,
      show: {
        type: Boolean,
        default: false
      },
      showCell: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        startDate: '',
        endDate: '',
        currentValue: [],
        cellFormat (val) {
          return val[0] + ' ' + val[1] + ':' + val[2]
        }
      }
    },
    created(){
      let currentDate = new Date();
      this.startDate = dateFormat(this.sdate || currentDate, this.format);
      currentDate.setMonth(currentDate.getMonth() + 1);
      this.endDate = dateFormat(currentDate, this.format);

      this.currentValue = this.buildCurrentValue(dateFormat(this.value));
    },
    computed: {
      list () {
        const datesNames = getDateRange(this.startDate, this.endDate, this.format)
        const datesValues = getDateRange(this.startDate, this.endDate, 'YYYY-MM-DD')
        const hours = getNumberRange(0, 23)
        const minutes = ['00', '30']
        return [datesNames.map((one, index) => {
          return {
            name: one,
            value: datesValues[index]
          }
        }), hours, minutes]
      }
    },
    methods: {
      emitHide (val) {
        this.$emit('on-hide', val)
      },
      buildCurrentValue(val){
        if (!val) {
          return [];
        }
        if (val < this.startDate) {
          this.startDate = val;
        }
        let array = val.split(' ');
        let times = array[1].split(':');
        return [array[0], times[0], times[1]];
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('on-change', val)
        if (val && val[0]) {
          this.$emit('input', `${val[0]} ${val[1]}:${val[2]}`)
        }
      },
      value (val) {
        this.currentValue = this.buildCurrentValue(dateFormat(val))
      },
      sdate (val) {
        if (val > this.startDate) {
          this.startDate = val;
        }
      }
    }
  }
</script>
