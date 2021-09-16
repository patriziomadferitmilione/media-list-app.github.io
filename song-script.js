// Song Class: Represents a song

class Song {
    constructor(title, artist) {
        this.title = title;
        this.artist = artist;
    }
}

// UI Class: Handle UI tasks

class UI {
    static displaySongs() {
        const songs = Store.getSongs();

        songs.forEach((song) => UI.addSongToList(song));
    }

    static addSongToList(song) {
        const list = document.querySelector('#song-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="text-light">${song.title}</td>
            <td class="text-light">${song.artist}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteSong(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#song-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#artist').value = '';
    }
}

// Store Class: Handles Storage

class Store {
    static getSongs() {
        let songs;
        if(localStorage.getItem('songs') === null) {
            songs = [];
        } else {
            songs = JSON.parse(localStorage.getItem('songs'));
        }

        return songs;
    }

    static addSong(song) {
        const songs = Store.getSongs();

        songs.push(song);

        localStorage.setItem('songs', JSON.stringify(songs));
    }

    static removeSong(title) {
        const songs = Store.getSongs();

        songs.forEach((song, index) => {
            if(song.title === title) {
                songs.splice(index, 1);
            }
        });

        localStorage.setItem('songs', JSON.stringify(songs));
    }
}

// Event: Display Songs

document.addEventListener('DOMContentLoaded', UI.displaySongs);

// Event: Add a song

document.querySelector('#song-form').addEventListener('submit', (e) => {
    //Prevent Actual submit
    e.preventDefault();

    //Get Form Values
    const title = document.querySelector('#title').value;
    const artist = document.querySelector('#artist').value;

    //Validate

    if(title === '' || artist === '') {
        UI.showAlert('Please fill in all fields', danger);
    } else {
        //Instantiate song
        const song = new Song(title, artist);

        //Add song to UI
        UI.addSongToList(song);

        //Add song to store
        Store.addSong(song);

        //Show success message
        UI.showAlert('Song Added', 'success');

        //Clear fields
        UI.clearFields();
    }
})

// Event: Remove a song

document.querySelector('#song-list').addEventListener('click', (e) => {

    //Remove song from UI
    UI.deleteSong(e.target);

    //Remove song from store
    Store.removeSong(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Song Removed', 'success');
});

