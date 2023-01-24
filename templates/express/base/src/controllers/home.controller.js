<%if(useTypescript){_%>
import { Request, Response } from 'express'; 
<%}_%>

export const getHome = async (req <%=useTypescript ? ": Request " : "" %>, res <%=useTypescript ? ": Response " : "" %>) => {
	try {
		res.status(200).send({ message: 'Hello from <%= appName %> : <%= port %>!' });
	} catch (e <%=useTypescript ? ": any " : "" %>) {
		res.status(500).send(e.toString());
	}
};
