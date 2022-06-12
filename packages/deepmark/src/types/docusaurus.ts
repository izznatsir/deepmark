export interface DocusaurusTranslations {
	[Key: string]:
		| string
		| number
		| {
				message: string;
				description: string;
		  }
		| {
				type: string;
				title?: string;
				description?: string;
		  };
}
