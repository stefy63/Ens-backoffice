import { Injectable } from '@angular/core';
import { ITicket } from '../../../interfaces/i-ticket';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class NormalizeTicket {

    public static normalizeItems(ticket: ITicket[]): any {
        return _.map(ticket, (item: ITicket) => {
            const closed_at = (item.status && (item.status.status === 'CLOSED' || item.status.status === 'REFUSED')) ? _.chain(item.historys)
                .filter(elem => elem.type.type === 'SYSTEM')
                .orderBy(['date_time'], ['ASC'])
                .findLast()
                .value() : '';

            return {
                id: item.id,
                id_service: item.id_service,
                id_status: item.id_status,
                service: item.service.service,
                status: (item.status) ? item.status.status : item.status.status,
                id_operator: item.id_operator,
                id_user: item.id_user,
                id_user_unknown: item.id_user_unknown,
                operator_name: (item.operator) ? item.operator.userdata.name : '',
                operator_surname: (item.operator) ? item.operator.userdata.surname : '',
                user_name: (item.user) ? item.user.userdata.name : (item.userUnknown) ? 'UNKNOWN' : '',
                // tslint:disable-next-line:max-line-length
                user_surname: (item.user) ? item.user.userdata.surname : (item.userUnknown) ? (item.userUnknown.email) ? `(${item.userUnknown.email})` : `(${item.userUnknown.phone})` : '',
                category: (item.category) ? item.category.category : 'UNCATEGORIZED',
                date_time: item.date_time, // moment(item.date_time).format('DD/MM/YYYY HH:mm'),
                historys: item.historys,
                reports: item.reports,
                closed_at: (closed_at) ? moment.utc(closed_at.date_time).format('DD/MM/YYYY HH:mm') : undefined,
                unreaded_messages: item.unreaded_messages || 0
            };
        });
    }

}

