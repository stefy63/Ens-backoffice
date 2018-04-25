
export class UserNavigationModel {
    public model: any[];

    constructor() {

        this.model = [
            {
                'id': 'pages',
                'title': 'Funzioni',
                'type': 'group',
                'icon': 'pages',
                'children': [
                    {
                        'id': 'user-dashboard',
                        'title': 'DashBoard',
                        'type': 'item',
                        'icon': 'pages',
                        'url': '/pages/user/user-dashboard'
                    }, {
                        'id': 'user-chat',
                        'title': 'Chat',
                        'type': 'item',
                        'icon': 'chat',
                        'url': '/pages/user/user-chat'
                    }, {
                        'id': 'user-videochat',
                        'title': 'Video Chat',
                        'type': 'item',
                        'icon': 'video_call',
                        'url': '/pages/user/user-videochat'
                    },
                ]
            }];
    }
}
