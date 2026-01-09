const { URL } = require('url');

/**
 * Classe utilitária para funções auxiliares do projeto
 */
class Util {
  /**
   * Valida se uma string é uma URL válida
   * @param {string} url - A URL a ser validada
   * @returns {boolean} - True se válida, false caso contrário
   */
  static validarURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sanitiza uma string removendo caracteres especiais perigosos
   * @param {string} str - A string a ser sanitizada
   * @returns {string} - String sanitizada
   */
  static sanitizarString(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>\"'&]/g, '').trim();
  }

  /**
   * Gera um ID único simples (exemplo básico, use UUID em produção)
   * @returns {string} - ID único
   */
  static gerarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Verifica se uma string está vazia ou apenas espaços
   * @param {string} str - A string a ser verificada
   * @returns {boolean} - True se vazia, false caso contrário
   */
  static isEmpty(str) {
    return !str || str.trim().length === 0;
  }

  /**
   * Valida se um email é válido
   * @param {string} email - O email a ser validado
   * @returns {boolean} - True se válido, false caso contrário
   */
  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

module.exports = Util;