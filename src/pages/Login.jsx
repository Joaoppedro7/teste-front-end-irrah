import React from 'react';
import styles from './Login.module.css'
import { Button } from '../components/Button.jsx'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { use } from 'react';
import { joiResolver } from '@hookform/resolvers/joi'
import Joi, { valid } from 'joi';
import { Navigate, useNavigate } from 'react-router-dom';


export function Login() {
  const pageChats = useNavigate();

  const validationForm = Joi.object({
    document: Joi.string().required().custom((value, helpers) => {
      const cleanedValue = value.replace(/\D/g, '')
      if (cleanedValue.length === 11) {
        if (!cpfIsValid(value)) {
          return helpers.message('Documento Inválido')
        }
        return value;
      }
      if (cleanedValue.length === 14) {
        if (!cnpjIsValid(value)) {
          return helpers.message('Documento Inválido')
        }
        return value;
      }
      return helpers.message('Documento Inválido')
    }),
    typePerson: Joi.valid('Pessoa Física', "Pessoa Jurídica"),
  })


  const { register, handleSubmit, formState } = useForm({
    resolver: joiResolver(validationForm)
  })

  const error = formState.errors.document?.message;

  function handleCreate(data) {
    console.log(data)

    pageChats('/history')
  }


  //Função para validar o CPF inserido no input

  function cpfIsValid(cpf) {
    if (typeof cpf !== "string") return false
    cpf = cpf.replace(/[\s.-]*/igm, '')
    if (
      !cpf ||
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    ) {
      return false
    }
    let soma = 0
    let resto
    for (let i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(9, 10))) return false
    soma = 0
    for (let i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(10, 11))) return false
    return true
  }

  //Função para validar o CNPJ inserido no input
  function cnpjIsValid(cnpjNotClean) {
    let cnpj = cnpjNotClean.replace(/[^\d]+/g, "");

    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    )
      return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
        <h1 className={styles.organization}>Big Chat Brasil</h1>


        <input
          type="text"
          placeholder="CPF/CNPJ"
          {...register('document')}
          maxLength={18}
        />

        {error && <p className={styles.errorMessage}> {error}</p>}

        <div className={styles.personInner}>
          <label className={styles.type}>Tipo:</label>
          <div className={styles.personType}>
            <input
              id='pf'
              type="radio"
              value={"Pessoa Física"}
              {...register('typePerson')}
            />
            <span className={styles.customRadio}></span>
            <label htmlFor="pf">PF</label>
          </div>

          <div className={styles.personType}>
            <input
              id='pj'
              type="radio"
              value={"Pessoa Jurídica"}
              {...register('typePerson')}
            />
            <span className={styles.customRadio}></span>
            <label htmlFor="pj">PJ</label>
          </div>
        </div>

        <Button variant={'primary'}>{'Entrar'}</Button>
      </form>
    </div >
  );
}

