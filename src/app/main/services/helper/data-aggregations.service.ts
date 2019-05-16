import { Injectable } from '@angular/core';
import { Services } from '../../../enums/ticket-services.enum';
import { chain, groupBy, sumBy, mapValues, map} from 'lodash';
import { validateBasis } from '@angular/flex-layout';

@Injectable()
export class DataAggregationsService {

  private retSumByMonthAndService = [
    {
      'name': 'CHAT',
      'series': [
        {
          'name': '2019/01',
          'value': 8989898
        }
      ]
    },
    // .
    // .
    // .

  ]

  constructor() { }


  sumByServices(data) {
    const result = chain(data)
                    .groupBy(item => item.ticket_service_name)
                    .mapValues(values => {
                      return {
                        'name': values[0].ticket_service_name,
                        'value': sumBy(values, (value) => parseInt(value.ticket_sub_total))
                      }
                    })
                    .value();
    return result;
  }


  sumByMonthAndServices(data) {
    const result = chain(data)
      .groupBy(item => item.ticket_service_name)
      .mapValues(values => {
        return {
          'name': values[0].ticket_service_name,
          'series': this.__sumByMonth(values)
        }
      })
      .map((item, key) => {
        return {
          'name': key,
          'series': item.series
        }
      })
      .value();

    return result;
  }

  sumByOfficeAndServices(data) {
    const result = chain(data)
        .groupBy(item => `${item.ticket_office_name}`)
        .mapValues(values => {
          const retSumByService = this.sumByServices(values);
          return {
            'name': `${values[0].ticket_office_name}`,
            'value': map(retSumByService, val => val.value)[0]
          }
        })
        .value();
    console.log('sumByOfficeAndServices--->', result);
    return result;
  }

  sumByServicesAndOffice(data) {
    const result = chain(data)
        .groupBy(item => item.ticket_service_name)
        .mapValues(values => {
          return {
            'name': values[0].ticket_service_name,
            'series': this.__sumByOffices(values)
          }
        })
        .map((item, key) => {
          return {
            'name': key,
            'series': item.series
          }
        })
        .value();
    console.log('sumByServicesAndOffice--->', result);
    return result;
  }

  sumByServicesAndOperator(data) {
    const result = chain(data)
        .groupBy(item => `[${item.ticket_operator}] ${item.ticket_operator_surname} ${item.ticket_operator_name}`)
        .mapValues(values => this.sumByServices(values))
        .value();
    console.log('sumByServicesAndOperator--->', result);
    return result;
  }


  private __sumByOffices(data) {
    const result = chain(data)
                    .groupBy(item => item.ticket_office_name)
                    .mapValues(values => {
                      return {
                        'name': values[0].ticket_office_name,
                        'value': sumBy(values, (value) => parseInt(value.ticket_sub_total))
                      }
                    })
                    .map(item => {
                      return {
                        'name': item.name,
                        'value': item.value
                      }
                    })
                    .value();
    return result;
  }

  private __sumByMonth(data) {
    const result = chain(data)
                    .groupBy(item => `${item.ticket_year}/${(item.ticket_month < 10) ? `0${item.ticket_month}` : item.ticket_month}`)
                    .mapValues(values => {
                      const retSumByService = this.sumByServices(values);
                      return {
                        'name': `${values[0].ticket_year}/${(values[0].ticket_month < 10) ? `0${values[0].ticket_month}` : values[0].ticket_month}`,
                        'value': map(retSumByService, val => val.value)[0]
                      }
                    })
                    .map(item => {
                      return {
                        'name': item.name,
                        'value': item.value
                      }
                    })
                    .value();

    return result;
  }


}
