import { Request, Response } from 'express';

export const getHome = async (req: Request, res: Response) => {
	try {
		res.status(200).send({ message: 'Hello world!' });
	} catch (e: any) {
		res.status(500).send(e.toString());
	}
};
