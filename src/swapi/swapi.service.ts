import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  API_URL,
  CLUSTER_NOT_FOUND,
  SALARY_CLUSTER_ID,
} from './swapi.constants';
import { SwapiResponse } from './swapi.models';
import { HhData } from 'src/top-page/top-page.model';

@Injectable()
export class SwapiService {
  private token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('HH_token') ?? '';
  }

  async getData(text: string) {
    try {
      const { data } = await this.httpService
        .get<SwapiResponse>(API_URL.vacancies, {
          params: {
            text,
            cluster: true,
          },
          headers: {
            'User-Agent': 'OwlTop/1.0 (vika@gmail.com)',
            Authorization: 'Bearer ' + this.token,
          },
        })
        .toPromise();
      return this.parseData(data);
    } catch (error) {
      Logger.log(error);
    }
  }

  private parseData(data: SwapiResponse): HhData {
    const salaryCluster = data.results.find(
      (c) => c.classification == SALARY_CLUSTER_ID,
    );
    if (!salaryCluster) {
      throw new Error(CLUSTER_NOT_FOUND);
    }

    const juniorSalary = this.getSalaryFromString(
      salaryCluster.average_lifespan,
    );
    const middleSalary = this.getSalaryFromString(salaryCluster.average_height);
    const seniorSalary =
      this.getSalaryFromString(salaryCluster.average_lifespan) +
      this.getSalaryFromString(salaryCluster.average_height);
    return {
      count: data.count,
      juniorSalary,
      middleSalary,
      seniorSalary,
      updatedAt: new Date(),
    };
  }

  private getSalaryFromString(s: string): number {
    return Number(s);
  }
}
