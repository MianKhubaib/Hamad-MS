import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

enum OutputType {
  Dataset = 'Dataset',
  Report = 'Report',
  Dashboard = 'Dashboard',
}

enum ResponsilbeTeam {
  MicroStrategy = 'MicroStrategy',
  Power_Insight = 'Power Insight',
  Tableau = 'Tableau',
}

enum Priority {
  Low = 'Low',
  Mid = 'Mid',
  High = 'High',
}

enum Complexity {
  Low = 'Low',
  Mid = 'Mid',
  High = 'High',
}

export class AssignmentDataDTO {
  @ApiProperty({ description: 'Output Type' })
  @IsString()
  @IsOptional()
  @IsIn(Object.values(OutputType))
  assignments_output_type: string;

  @ApiProperty({ description: 'assignments_responsible_team' })
  @IsString()
  @IsOptional()
  @IsIn(Object.values(ResponsilbeTeam))
  assignments_responsible_team: string;

  @ApiProperty({ description: 'assignments_priority' })
  @IsString()
  @IsOptional()
  @IsIn(Object.values(Priority))
  assignments_priority: string;

  @ApiProperty({ description: 'assignments_complexity' })
  @IsString()
  @IsOptional()
  @IsIn(Object.values(Complexity))
  assignments_complexity: string;

  @ApiProperty({ description: 'assignments_bui_expectedDate' })
  @IsString()
  @IsOptional()
  assignments_bui_expectedDate: Date;

  @ApiProperty({ description: 'assigned_business_analystId' })
  @IsString()
  @IsOptional()
  assigned_business_analystId: string;

  @ApiProperty({ description: 'assigned_business_analyst_name' })
  @IsString()
  @IsOptional()
  assigned_business_analyst_name: string;

  @ApiProperty({ description: 'assigned_technical_analystId' })
  @IsString()
  @IsOptional()
  assigned_technical_analystId: string;

  @ApiProperty({ description: 'assigned_technical_analyst_name' })
  @IsString()
  @IsOptional()
  assigned_technical_analyst_name: string;
}
