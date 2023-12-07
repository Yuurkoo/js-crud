// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(2000 + Math.random() * 9000) // Генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  // Створення obj Track і додавання його до #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Створення для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  static getById = (id) => {
    return this.#list.find((track) => track.id === id)
  }
}

Track.create(
  'Shameless',
  'Camila Cabella',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Commigo (Remix)',
  'Selena Gomez / Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Кольорово',
  'Скрябін Кузьма',
  'https://picsum.photos/100/100',
)
Track.create(
  'Хай нам брате пощастить',
  'YARMAK',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Генеруємо випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  // Створення obj Playlist і додавання його до #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // Створення для отримання всього списку плейлистів
  static getList() {
    return this.#list.reserve()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTrack = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTrack)
  }

  // по індентифікатору можна знайти плейлист
  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(track) {
    // Перевірємо, чи трек вже існує в плейлисті
    const isTrackAlreadyAdded = this.tracks.some(
      (t) => t.id === track.id,
    )

    if (!isTrackAlreadyAdded) {
      this.tracks.push(track)
      return true // Повертаємо true, якщо трек було успішно додано
    }

    return false // Повертаємо false, якщо трек вже існує в плейлисті
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test-1'))
Playlist.makeMix(Playlist.create('Test-3'))

// ================================================================
router.get('/', function (req, res) {
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-library', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-library',

    data: {
      img: 'https://picsum.photos/100/100',
      amount: 3,
    },
  })
})

// ================================================================
router.get('/spotify-choose', function (req, res) {
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
})

// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлисту',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }
  // ~~~~~~~~ цей фрагмент коду відповідає за відображення назви плейліста в консолі та наповненням його 3-ма рандомними треками

  const playlist = Playlist.create(name) //створення плейліста в router.post('/spotify-create'

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id) //отримуємо індентифікатор

  const playlist = Playlist.getById(id) // по id отримуємо плейлист

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлисту не знайдено',
        link: '/',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId) // отримуємо сам плейлист

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлисту не знайдено',
        link: `spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value) // знвходимо список

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        //певна конвертація
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value) // знвходимо список

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        //певна конвертація
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================
router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
    },
  })
})

// ================================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId) // Отримайте плейлист

  const track = Track.getById(trackId) //знаходимо трек за його id

  // Перевіряємо чи трек вже існує в плейлисті
  const isTrackAlreadyAdded = playlist.tracks.some(
    (t) => t.id === track.id,
  )

  if (isTrackAlreadyAdded) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Трек вже існує в плейлисті',
        link: `spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.tracks.push(track) //Додаємо трек до плейлисту

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
