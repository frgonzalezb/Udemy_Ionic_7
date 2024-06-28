class DDREvent {
  id!: string;
  title!: string;
  description!: string;
  dateStart!: string;
  dateEnd!: string | null;
  type!: string;
  url!: string;
}

export default DDREvent;
