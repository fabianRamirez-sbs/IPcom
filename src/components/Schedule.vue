<template>
  <section>
    <div class="inline-flex">
      <button v-on:click="getLastWeek()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4">
        {{ setTitleCurrentWeek }}
      </button>
      <button v-on:click="getNextWeek()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
    <div class="cd-schedule loading">
      <div class="timeline">
        <ul>
          <li v-for="hours in hoursList" :key="hours">
            <span>{{ hours }}</span>
          </li>
        </ul>
      </div>
      <!-- timeline -->
      <div class="events">
        <ul class="wrap">
          <li v-for="(day, index) in daysList" :key="day.id" class="events-group">
            <div class="top-info">
              <span>{{ day.name }}- {{index}} <br> {{ day.date }}</span>
            </div>
            <!-- events -->
            <ul>
              <li
                v-for="item in setData(day.date)" :key="item"
                v-bind:style="{ top: eventPosition(item, null) + 'px', height: 50 + 'px' }"
                class="single-event error"
                data-content="event-abs-circuit"
                data-event="event-1">
                <a>
                  <em class="event-name">{{ item }}</em>
                </a>
              </li>
              <li
                v-for="item in setDataNew(day.date)" :key="item"
                v-bind:style="{ top: eventPosition(item, null) + 'px', height: 50 + 'px' }"
                class="single-event"
                data-content="event-abs-circuit"
                data-event="event-1">
                <a>
                  <em class="event-name">{{ item }}</em>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="postEvent">
      <form class="w-full">
        <div class="flex flex-wrap mb-12">
          <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <input type="date" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              :placeholder="form.date"
              v-model="form.date"
              required>
          </div>
          <div class="w-full md:w-1/4 px-3">
            <input type="time" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              :placeholder="form.hour"
              v-model="form.hour"
              min="08:00" max="20:00"
              required>
          </div>
          <div class="w-full md:w-1/4 px-3">
            <button v-on:click="postEvents" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 mb-3 w-full rounded">
              Agendar
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  data () {
    return {
      form: {
        date: new Date(),
        hour: null
      },
      today: new Date(),
      currentWeek: [],
      hoursList: [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ],
      daysList: [
        {
          'id': 'Domingo',
          'name': 'Domingo',
          'date': null
        },
        {
          'id': 'Lunes',
          'name': 'Lunes',
          'date': null
        },
        {
          'id': 'Martes',
          'name': 'Martes',
          'date': null
        },
        {
          'id': 'Miércoles',
          'name': 'Miércoles',
          'date': null
        },
        {
          'id': 'Jueves',
          'name': 'Jueves',
          'date': null
        },
        {
          'id': 'Viernes',
          'name': 'Viernes',
          'date': null
        },
        {
          'id': 'Sábado',
          'name': 'Sábado',
          'date': null
        }
      ]
    }
  },
  computed: {
    setTitleCurrentWeek () {
      return `${this.currentWeek[0]} - ${this.currentWeek[6]}`
    },
    ...mapState('ScheduleStore', [
      'scheduled'
    ])
  },
  methods: {
    getEvents (dataCurrentWeek) {
      for (const iterator of dataCurrentWeek) {
        store
          .dispatch('ScheduleStore/GET_hoursAvailable', iterator)
          .then(
            (response) => {
            },
            (error) => {
              return new Error(error)
            }
          )
      }
    },
    postEvents (e) {
      e.preventDefault()
      store
        .dispatch('ScheduleStore/POST_schedule', this.form)
        .then(
          (response) => {
            alert(`Se creó el evento para el dia ${response.data.date} a las ${response.data.hour} - Status ${response.status}`)
          },
          (error) => {
            return new Error(error)
          }
        )
    },
    setDataNew (today) {
      let newArray = []
      if (this.form.date === today && this.form !== null) {
        newArray.push(this.form.hour.toString())
      }
      return newArray
    },
    setData (today) {
      let newArray = []
      this.scheduled.filter(scheduled => {
        if (scheduled.date === today) {
          newArray = scheduled.scheduled
        }
      })
      return newArray
    },
    createDate (day) {
      let parts = day.split('-')
      return new Date(parts[0], parts[1] - 1, parts[2])
    },
    getCurrentWeek (newDay) {
      this.currentWeek = []
      for (let i = 0; i <= 6; i++) {
        let first = newDay.getDate() - newDay.getDay() + i
        let day = new Date(newDay.setDate(first)).toISOString().slice(0, 10)
        this.currentWeek.push(day)
        this.daysList[i].date = (day)
      }
    },
    getLastWeek () {
      let newDay = this.createDate(this.currentWeek[0])
      newDay.setDate(newDay.getDate() - 1)
      this.getCurrentWeek(newDay)
    },
    getNextWeek () {
      let newDay = this.createDate(this.currentWeek[6])
      newDay.setDate(newDay.getDate() + 1)
      this.getCurrentWeek(newDay)
    },
    eventPosition (initiation, finish) {
      if (finish != null) {
        let startMinutes = parseInt(initiation.substr(3, 2))
        let startHours = parseInt(initiation.substr(0, 2))
        let finMinutes = parseInt(finish.substr(3, 2))
        let finHours = parseInt(finish.substr(0, 2))
        let elapsedMinutes = finMinutes - startMinutes
        let elapsedHours = finHours - startHours
        if (elapsedMinutes < 0) {
          elapsedHours--
          elapsedMinutes = 60 + elapsedMinutes
        }
        var heightHours = elapsedHours * 50
        var heightMinutes = (((elapsedMinutes * 100) / 60) * 50) / 100
        let positionTop = (startHours - 8) * 50
        return {
          top: positionTop,
          height: heightHours + heightMinutes
        }
      } else {
        let startHours = parseInt(initiation.substr(0, 2))
        let startMinutes = parseInt(initiation.substr(3, 2))
        let heightHours = (startHours - 8) * 50
        let heightMinutes = (((startMinutes * 100) / 60) * 50) / 100
        return heightHours + heightMinutes
      }
    }
  },
  watch: {
    currentWeek () {
      this.getEvents(this.currentWeek)
    }
  },
  mounted () {
    this.getEvents(this.currentWeek)
  },
  created () {
    this.getCurrentWeek(this.today)
  }
}
</script>

<style scoped>
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-size: 1.6rem;
    font-family: "Source Sans Pro", sans-serif;
    color: #222222;
    background-color: white;
  }

  a {
    color: #a2b9b2;
    text-decoration: none;
  }

  .cd-schedule {
    position: relative;
    margin: 2em 0;
  }

  .cd-schedule::before {
    content: "mobile";
    display: none;
  }

  @media only screen and (min-width: 800px) {
    .cd-schedule {
      width: 90%;
      max-width: 1400px;
      margin: 2em auto;
    }
    .cd-schedule::after {
      clear: both;
      content: "";
      display: block;
    }
    .cd-schedule::before {
      content: "desktop";
    }
  }

  .cd-schedule .timeline {
    display: none;
  }

  @media only screen and (min-width: 800px) {
    .cd-schedule .timeline {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      padding-top: 50px;
      text-align: start;
    }
    .cd-schedule .timeline li {
      position: relative;
      height: 50px;
    }
    .cd-schedule .timeline li::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: #eaeaea;
    }
    .cd-schedule .timeline li:last-of-type::after {
      display: none;
    }
    .cd-schedule .timeline li span {
      display: none;
    }
  }

  @media only screen and (min-width: 1000px) {
    .cd-schedule .timeline li::after {
      width: calc(100% - 60px);
      left: 60px;
    }
    .cd-schedule .timeline li span {
      display: inline-block;
      transform: translateY(100%);
    }
  }

  .cd-schedule .events {
    position: relative;
    z-index: 1;
  }

  .cd-schedule .events .events-group {
    margin-bottom: 30px;
  }

  .cd-schedule .events .top-info {
    width: 100%;
    padding: 0 5%;
  }

  .cd-schedule .events .top-info > span {
    display: inline-block;
    line-height: 1.2;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .cd-schedule .events .events-group > ul {
    position: relative;
    padding: 0 5%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    overflow-x: scroll;
  }

  .cd-schedule .events .events-group > ul::after {
    display: inline-block;
    content: "-";
    width: 1px;
    height: 100%;
    opacity: 0;
    color: transparent;
  }

  .cd-schedule .events .single-event {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    float: left;
    height: 150px;
    width: 70%;
    max-width: 300px;
    box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);
    margin-right: 20px;
    transition: opacity 0.2s, background 0.2s;
  }

  .cd-schedule .events .single-event.error {
    background-color: tomato;
  }

  .cd-schedule .events .single-event:last-of-type {
    margin-right: 5%;
  }

  .cd-schedule .events .single-event a {
    display: block;
    height: 100%;
    padding: 0.8em;
  }

  @media only screen and (min-width: 550px) {
    .cd-schedule .events .single-event {
      width: 40%;
    }
  }

  @media only screen and (min-width: 800px) {
    .cd-schedule .events {
      float: left;
      width: 100%;
    }
    .cd-schedule .events .events-group {
      width: 14%;
      float: left;
      border: 1px solid #eaeaea;
      margin-bottom: 0;
    }
    .cd-schedule .events .events-group:not(:first-of-type) {
      border-left-width: 0;
    }
    .cd-schedule .events .top-info {
      display: table;
      height: 50px;
      border-bottom: 1px solid #eaeaea;
      padding: 0;
    }
    .cd-schedule .events .top-info > span {
      display: table-cell;
      vertical-align: middle;
      padding: 0 0.5em;
      text-align: center;
      font-weight: normal;
      margin-bottom: 0;
    }
    .cd-schedule .events .events-group > ul {
      height: 650px;
      display: block;
      overflow: visible;
      padding: 0;
    }
    .cd-schedule .events .events-group > ul::after {
      clear: both;
      content: "";
      display: block;
    }
    .cd-schedule .events .events-group > ul::after {
      display: none;
    }
    .cd-schedule .events .single-event {
      position: absolute;
      z-index: 3;
      width: calc(100% + 2px);
      left: -1px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1),
        inset 0 -3px 0 rgba(0, 0, 0, 0.2);
      flex-shrink: 1;
      height: auto;
      max-width: none;
      margin-right: 0;
    }
    .cd-schedule .events .single-event a {
      padding: 1.2em;
    }
    .cd-schedule .events .single-event:last-of-type {
      margin-right: 0;
    }
    .cd-schedule .events .single-event.selected-event {
      visibility: hidden;
    }
  }

  @media only screen and (min-width: 1000px) {
    .cd-schedule .events {
      width: calc(100% - 60px);
      margin-left: 60px;
    }
  }

  /* .cd-schedule.loading .events .single-event {
    opacity: 0;
  } */

  .cd-schedule .event-name,
  .cd-schedule .event-date {
    display: block;
    color: white;
    font-weight: bold;
  }

  .cd-schedule .event-name {
    font-size: 2.4rem;
  }

  @media only screen and (min-width: 800px) {
    .cd-schedule .event-name {
      font-size: 1rem;
    }
  }

  .cd-schedule .event-date {
    font-size: 1.4rem;
    opacity: 0.7;
    line-height: 1.2;
    margin-bottom: 0.2em;
  }

  .cd-schedule .single-event[data-event="event-1"],
  .cd-schedule [data-event="event-1"] .header-bg {
    background: #577f92;
  }

  .cd-schedule .single-event[data-event="event-1"]:hover {
    background: #618da1;
  }
  .cd-schedule .single-event.error[data-event="event-1"]:hover {
    background: #f76666;
  }

  .cd-schedule .single-event[data-event="event-2"],
  .cd-schedule [data-event="event-2"] .header-bg {
    background: #443453;
  }

  .cd-schedule .single-event[data-event="event-2"]:hover {
    background: #513e63;
  }

  .cd-schedule .single-event[data-event="event-3"],
  .cd-schedule [data-event="event-3"] .header-bg {
    background: #a2b9b2;
  }

  .cd-schedule .single-event[data-event="event-3"]:hover {
    background: #b1c4be;
  }

  .cd-schedule .single-event[data-event="event-4"],
  .cd-schedule [data-event="event-4"] .header-bg {
    background: #f6b067;
  }

  .cd-schedule .single-event[data-event="event-4"]:hover {
    background: #f7bd7f;
  }

  @media only screen and (min-width: 800px) {
  }

  @media only screen and (min-width: 1000px) {
  }

  @media only screen and (min-width: 800px) {
    .cd-schedule.modal-is-open .body-bg {
      opacity: 1;
      transition: -webkit-transform 0.4s;
      transition: transform 0.4s;
      transition: transform 0.4s, -webkit-transform 0.4s;
      transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
    }
  }

  .cd-schedule .cover-layer {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s, visibility 0.4s;
  }

  .cd-schedule.modal-is-open .cover-layer {
    opacity: 1;
    visibility: visible;
  }
</style>
