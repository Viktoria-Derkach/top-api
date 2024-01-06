import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create({ ...dto, typegooseName: 'custom' });
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findByCategory(dto: FindTopPageDto) {
    console.log(dto, 'dto');

    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstLevelCategory: dto.firstLevelCategory,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: 5,
        },
        // {
        //   $addFields: {
        //     producid: { $toString: '$_id' },
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'Review',
        //     localField: 'producid',
        //     foreignField: 'productId',
        //     as: 'reviews',
        //   },
        // },
        // {
        //   $addFields: {
        //     reviewCount: { $size: '$reviews' },
        //     reviewAvg: { $avg: '$reviews.rating' },
        //     reviews: {
        //       $function: {
        //         body: `function (reviews) {
        //           reviews.sort(
        //             (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        //           );
        //           return reviews;
        //         }`,
        //         args: ['$reviews'],
        //         lang: 'js',
        //       },
        //     },
        //   },
        // },
      ])
      .exec() as TopPageModel[];
  }

  async findAllPages() {
    return this.topPageModel.find({}).exec();
  }
}
