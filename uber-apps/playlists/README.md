# Playlists - Hypermedia experiment based on Tasks

The client app is a simple video player in html5 and javascript. Once the server is running access the client like so ..

	http://localhost:3001/

Request the one and only playlist by hitting the [playlist #1] button and some uber json will be served from ..

	http://localhost:3001/playlists/

That's it. Here's an example of the json provided by the API.


```JSON
{
    "uber": {
        "version": "1.0",
        "data": [
            {
                "id": "links",
                "data": [
                    {
                        "id": "poster",
                        "rel": "icon",
                        "url": "http://files.tested.com/uploads/0/5/35506-html5_teaser.jpg",
                        "action": "read"
                    },
                    {
                        "id": "list",
                        "rel": "collection",
                        "name": "links",
                        "url": "/playlists/",
                        "action": "read"
                    },
                    {
                        "id": "search",
                        "rel": "search",
                        "name": "links",
                        "url": "/playlists/search",
                        "action": "read",
                        "model": "?text={text}"
                    },
                    {
                        "id": "add",
                        "rel": "add",
                        "name": "links",
                        "url": "/playlists/",
                        "action": "append",
                        "model": "text={text}"
                    }
                ]
            },
            {
                "id": "playlists",
                "data": [
                    {
                        "id": "video#1",
                        "rel": "item",
                        "name": "playlists"
                    },
                    [
                        {
                            "rel": "complete",
                            "url": "/playlists/complete/",
                            "model": "id=1",
                            "action": "append"
                        },
                        {
                            "data": [
                                {
                                    "name": "source"
                                },
                                "http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv",
                                {
                                    "name": "type"
                                },
                                "video/ogv",
                                {
                                    "name": "caption"
                                },
                                "http://camendesign.com/code/video_for_everybody/poster.jpg",
                                {
                                    "name": "text"
                                },
                                "Big Buck Bunny"
                            ]
                        }
                    ],
                    {
                        "id": "video#2",
                        "rel": "item",
                        "name": "playlists"
                    },
                    [
                        {
                            "rel": "complete",
                            "url": "/playlists/complete/",
                            "model": "id=2",
                            "action": "append"
                        },
                        {
                            "data": [
                                {
                                    "name": "source"
                                },
                                "http://demosthenes.info/assets/videos/nambia1.mp4",
                                {
                                    "name": "type"
                                },
                                "video/mp4",
                                {
                                    "name": "caption"
                                },
                                "http://demosthenes.info/assets/images/nambia1.jpg",
                                {
                                    "name": "text"
                                },
                                "Namibia Timelapse"
                            ]
                        }
                    ],
                    {
                        "id": "video#3",
                        "rel": "item",
                        "name": "playlists"
                    },
                    [
                        {
                            "rel": "complete",
                            "url": "/playlists/complete/",
                            "model": "id=3",
                            "action": "append"
                        },
                        {
                            "data": [
                                {
                                    "name": "source"
                                },
                                "http://www.808.dk/pics/video/gizmo.webm",
                                {
                                    "name": "type"
                                },
                                "video/webm",
                                {
                                    "name": "caption"
                                },
                                "http://developer.html5dev-software.intel.com/images/Video_Placeholder.png",
                                {
                                    "name": "text"
                                },
                                "Gizmo"
                            ]
                        }
                    ]
                ]
            }
        ]
    }
}
```
