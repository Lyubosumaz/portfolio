import React, { useState, useEffect } from 'react'

const useMultiAudio = urls => {
    const [sources] = useState(
        urls.map(url => {
            // fetch(url, {
            //     mode: 'cors',
            //     headers: {
            //         'Access-Control-Allow-Origin': '*'
            //     }
            // })
            //     .then(response => response.text())
            //     .then(data => console.log(data));
            let audio = new Audio();
            // audio.crossOrigin = 'anonymous';
            audio.src = url;
            return {
                url,
                audio: audio,
            }
        }),
    )

    const [players, setPlayers] = useState(
        urls.map(url => {
            return {
                url,
                playing: false,
            }
        }),
    )

    const toggle = targetIndex => () => {
        const newPlayers = [...players]
        const currentIndex = players.findIndex(p => p.playing === true)
        if (currentIndex !== -1 && currentIndex !== targetIndex) {
            newPlayers[currentIndex].playing = false
            newPlayers[targetIndex].playing = true
        } else if (currentIndex !== -1) {
            newPlayers[targetIndex].playing = false
        } else {
            newPlayers[targetIndex].playing = true
        }
        setPlayers(newPlayers)
    }

    useEffect(() => {
        const promises = []

        sources.forEach((source, i) => {
            source.audio.crossOrigin = 'anonymous';
            promises.push(players[i].playing ? source.audio.play() : source.audio.pause());
            // promises.push(source.audio.play());
        })

        Promise.all(promises);
    }, [sources, players])

    useEffect(() => {
        sources.forEach((source, i) => {
            source.audio.addEventListener('ended', () => {
                const newPlayers = [...players]
                newPlayers[i].playing = false
                setPlayers(newPlayers)
            })
        })
        return () => {
            sources.forEach((source, i) => {
                source.audio.removeEventListener('ended', () => {
                    const newPlayers = [...players]
                    newPlayers[i].playing = false
                    setPlayers(newPlayers)
                })
            })
        }
    }, [])

    return [players, toggle]
}

const MultiPlayer = ({ urls }) => {
    const [players, toggle] = useMultiAudio(urls)

    return (
        <div>
            {players.map((player, i) => (
                <Player key={i} player={player} toggle={toggle(i)} />
            ))}
        </div>
    )
}

const Player = ({ player, toggle }) => (
    <div>
        <p>Stream URL: {player.url}</p>
        <button onClick={toggle}>{player.playing ? 'Pause' : 'Play'}</button>
    </div>
)


export default MultiPlayer;