CREATE TABLE public.gisDocument(
  id integer NOT NULL,
  docname character(100),
  doctype character(100),
  docdesc text,
  localpath varchar, 
  weburl varchar,
  gtime timestamp,
  glocation varchar, 
  CONSTRAINT gisDocument_pkey PRIMARY KEY (id)
);

CREATE TABLE public.gisData(
  id integer NOT NULL,
  dataname character(100),
  datatype character(100),
  datadesc text,
  localpath varchar, 
  weburl varchar,
  gtime timestamp,
  glocation varchar, 
  CONSTRAINT gisData_pkey PRIMARY KEY (id)
);

CREATE TABLE public.gisSample(
  id integer NOT NULL,
  samname character(100),
  samtype character(100),
  samdesc text,
  localpath varchar, 
  weburl varchar,
  gtime timestamp,
  glocation varchar, 
  CONSTRAINT gisSample_pkey PRIMARY KEY (id)
);

CREATE TABLE public.gisAlgorithm(
  id integer NOT NULL,
  algname character(100),
  algtype character(100),
  algdesc text,
  localpath varchar, 
  weburl varchar,
  gtime timestamp,
  glocation varchar, 
  CONSTRAINT gisAlgorithm_pkey PRIMARY KEY (id)
);

CREATE TABLE public.gisCase(
  id integer NOT NULL,
  casename character(100),
  casetype character(100),
  casedesc text,
  localpath varchar, 
  weburl varchar,
  gtime timestamp,
  glocation varchar, 
  CONSTRAINT gisCase_pkey PRIMARY KEY (id)
);
