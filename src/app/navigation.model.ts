export class NavigationModel {
    public model: any[];

    constructor() {
        this.model = [
            {
                'id': 'pages',
                'title': 'Overview',
                'type': 'group',
                'icon': 'pages',
                'children': [
                    {
                        'id': 'dashboard',
                        'title': 'DashBoard',
                        'type': 'item',
                        'icon': 'pages',
                        'url': '/pages/dashboard'
                    },
                    {
                        'id': 'export',
                        'title': 'Report',
                        'type': 'item',
                        'icon': 'trending_up',
                        'url': '/pages/export-report',
                    },
                    {
                        'id': 'sms',
                        'title': 'Invia Sms',
                        'type': 'item',
                        'icon': 'send',
                        'url': '/pages/sending-sms',
                    },
                    {
                        'id': 'user_manager',
                        'title': 'Gestione Utenti',
                        'type': 'item',
                        'icon': 'accessibility_new',
                        'url': '/pages/user-manager',
                        'permission': ['user.update.all']
                    },
                    {
                        'id': 'statistics',
                        'title': 'Statistiche',
                        'type': 'item',
                        'icon': 'bar_chart',
                        'url': '/pages/statistics',
                        'permission': ['statistics.view']
                    },
                    {
                        'id': 'operator',
                        'title': 'Operatori',
                        'type': 'item',
                        'icon': 'cloud_download',
                        'url': '/pages/operator',
                        'permission': ['operator.export']
                    },
                ],
            },
        ];
    }
}
