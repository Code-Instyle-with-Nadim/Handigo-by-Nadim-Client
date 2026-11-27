import React from 'react';

const ServicePage = async ({searchParams}:{ searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const search = await searchParams;

  const urlSearch = new URLSearchParams(search as Record<string, string>).toString();

  const query = urlSearch.toString();
  console.log(query);
  return (
    <div>
      Services
    </div>
  );
};

export default ServicePage;