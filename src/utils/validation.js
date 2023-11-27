import {object, string, ref} from 'yup';
export const accountSchema = object({
  username: string()
    .trim('Tên đăng nhập không được chứa khoảng trắng')
    .required('Tên đăng nhập không được để trống')
    .min(8, 'Tên đăng nhập phải có ít nhất 8 ký tự')
    .max(24, 'Tên đăng nhập chỉ được tối đa 24 ký tự'),
  password: string()
    .min(8, 'Mật khẩu phải dài hơn 8 ký tự ')
    .required('Mật khẩu không được để trống')
    .matches(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      'Mật khẩu phải chứa ít nhất 1 ký tự viết hoa và 1 chữ số',
    ),
  newPassword: string()
    .min(8, 'Mật khẩu phải dài hơn 8 ký tự ')
    .required('Mật khẩu không được để trống')
    .matches(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      'Mật khẩu phải chứa ít nhất 1 ký tự viết hoa và 1 chữ số',
    ),
  confirmNewPassword: string()
    .required('Mật khẩu không được để trống')
    .test('passwords-match', 'Mật khẩu không trùng khớp', function (value) {
      return value === this.parent.newPassword;
    }),
  // .oneOf([ref('newPassword')], 'Mật khẩu không trùng khớp'),
  email: string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
});

export const nameSchema = object({
  firstname: string()
    .required('Không được để trống')
    .trim('Tên không được chứa khoảng trắng')
    .matches(
      /^[^\d!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/,
      'Tên không được chứa ký tự đặc biệt',
    ),
  lastname: string()
    .required('Không được để trống')
    .trim('Tên không được chứa khoảng trắng')
    .matches(
      /^[^\d!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/,
      'Tên không được chứa ký tự đặc biệt',
    ),
});

export const ageLimit = 13;

export const handleValidateField = (
  schema,
  key,
  value,
  validationErrors,
  setValidationErrors,
  data,
) => {
  let obj = {[key]: value};
  let s = schema.pick([key]);

  if (key === 'confirmNewPassword') {
    obj = {...obj, newPassword: data.newPassword};
    s = schema.pick([key, 'newPassword']);
  }

  s.validate(obj)
    .then(result => {
      const newValidationErros = {...validationErrors};
      delete newValidationErros[key];
      setValidationErrors(() => newValidationErros);
    })
    .catch(err => {
      setValidationErrors(pre => ({...pre, [err.path]: err.errors[0]}));
    });
};
export const handleValidateObject = (
  schema,
  obj,
  field,
  validationErrors,
  setValidationErrors,
) => {
  let s = schema.pick(field);
  keys = Object.keys(obj);
  s.validate(obj)
    .then(result => {
      const newValidationErros = {...validationErrors};
      for (let i = 0; i < keys.length; i++) {
        delete newValidationErros[keys[i]];
      }
      setValidationErrors(() => newValidationErros);
    })
    .catch(err => {
      setValidationErrors(pre => ({...pre, [err.path]: err.errors[0]}));
    });
};
