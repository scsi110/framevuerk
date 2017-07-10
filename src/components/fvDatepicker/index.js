import utility from '../../utility'
import locale from 'locale'
import template from './template.pug'
import style from './style.scss'
/* global CONFIG */
let moment

export default {
  props: {
    value: {
      default: null,
      required: true
    },
    inputClass: {
      default: ''
    },
    dialogClass: {
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pick: {
      type: Array,
      default: () => [
        'year',
        'month',
        'day',
        'sp',
        'hour',
        'minute',
        'second'
      ]
    },
    placeholder: {
      type: String,
      default: ''
    },
    displayFormat: {
      default: locale.momentDisplayFormat()
    }
  },
  data () {
    return {
      pDate: {}, // moment.utc(),
      pValue: {},
      displayValue: null,
      pShow: false,
      highlightedOption: null,
      dialogButtons: [
        {
          key: 'reset',
          icon: 'fa fa-circle-o',
          text: locale.selectNone(),
          class: 'fv-default'
        },
        {
          key: 'ok',
          icon: 'fa fa-check',
          text: locale.ok(),
          class: 'fv-primary'
        }
      ]
    }
  },
  computed: {
    pSections () {
      return this.pick.map((v) => {
        switch (v) {
        case 'year': return {
          type: 'pick',
          name: v,
          title: locale.year()
        }
        case 'month': return {
          type: 'pick',
          name: v,
          title: locale.month()
        }
        case 'day': return {
          type: 'pick',
          name: v,
          title: locale.day()
        }
        case 'hour': return {
          type: 'pick',
          name: v,
          title: locale.hour()
        }
        case 'minute': return {
          type: 'pick',
          name: v,
          title: locale.minute()
        }
        case 'second': return {
          type: 'pick',
          name: v,
          title: locale.second()
        }
        case 'sp': return {
          type: 'sp'
        }
        default: throw new Error('error in fv-datepicker pick attribute.')
        }
      })
    }
  },
  created () {
    moment = utility._dependencies.moment
    if (moment) {
      if (CONFIG.LOCALE === 'fa') {
        moment.loadPersian()
      }
      this.pSetValue(this.value === null ? null : moment.utc())
    } else {
      throw new Error('Moment not found!')
    }
  },
  methods: {
    open () {
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    pMath (action = 'add', type = 'day') {
      this.pDate[action](1, type + 's')
      this.pSetValue(this.pDate)
    },
    highlightOption (option = {index: null}) {
      this.highlightedOption = option.index
    },
    pFocus (el = 'input') {
      if (el === 'input') {
        this.$refs.inputEl.$el.focus()
      } else {
        this.$refs.dialog.pFocus()
      }
    },
    pIsSelected (option = {index: null, value: null}) {
      if (this.multiple && typeof this.value === 'object' && this.value !== null) {
        return this.value.indexOf(option.value) !== -1
      } else {
        return this.value === option.value
      }
    },
    pKeyDown (event) {
      switch (event.which) {
      case 38: // up
        if (this.highlightedOption !== null) {
          this.pMath('add', this.pSections[this.highlightedOption].name)
        }
        break
      case 40: // down
        if (this.highlightedOption !== null) {
          this.pMath('subtract', this.pSections[this.highlightedOption].name)
        }
        break
      case 37: // left
        this.highlightedOption = this.highlightedOption == null ? -1 : this.highlightedOption
        this.highlightedOption = this.highlightedOption + 1 >= this.pSections.length ? 0 : this.highlightedOption + 1
        this.highlightedOption = this.pSections[this.highlightedOption].type === 'sp' ? this.highlightedOption + 1 : this.highlightedOption
        break
      case 39: // right
        this.highlightedOption = this.highlightedOption == null ? this.pSections.length : this.highlightedOption
        this.highlightedOption = this.highlightedOption - 1 < 0 ? this.pSections.length - 1 : this.highlightedOption - 1
        this.highlightedOption = this.pSections[this.highlightedOption].type === 'sp' ? this.highlightedOption - 1 : this.highlightedOption
        break
      default:
        this.highlightedOption = null
      }
    },
    clickButton (action) {
      switch (action) {
      case 'reset':
        this.pSetValue()
        this.close()
        break
      default:
        this.pSetValue(this.pDate)
        this.close()
      }
    },
    pSetValue (date = null) { // receive moment date and set date to value
      let newValue = null
      if (date === null) {
        this.pDate = moment.utc()
      } else {
        this.pDate = date
        newValue = this.pDate.toDate()
      }
      this.pValue = {
        year: this.pDate.format(`${locale.momentFormatPrefix()}YYYY`),
        month: this.pDate.format(`${locale.momentFormatPrefix()}MMMM`),
        day: this.pDate.format(`${locale.momentFormatPrefix()}D`),
        hour: this.pDate.format('HH'),
        minute: this.pDate.format('mm'),
        second: this.pDate.format('ss')
      }
      this.$emit('input', newValue)
      this.$emit('change')
      if (date === null) {
        this.displayValue = null
      } else {
        this.displayValue = this.pDate.format(this.displayFormat)
      }
    },
    closeIf () {
      utility.doIt(() => {
        var focusedElem = document.querySelector(':focus')
        if (focusedElem !== null && !utility.isDescendant(this.$refs.datepicker.$el, focusedElem)) {
          this.close()
        }
      })
    }
  },
  style,
  render: template.render
}
