using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DAL.DBCOntext;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class GenericRepository<TModelo>:IGenericRepository<TModelo> where TModelo : class
{
    private readonly DbventaContext dbcontext;

    public GenericRepository(DbventaContext dbcontext)
    {
        _dbcontext = dbcontext;
    }

    public Task<IQueryable<TModelo>> Consultar(Expression<Func<TModelo, bool>>? filtro = null)
    {
        throw new NotImplementedException();
    }

    public Task<TModelo> Crear(TModelo modelo)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Editar(TModelo modelo)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Eliminar(TModelo modelo)
    {
        throw new NotImplementedException();
    }

    public Task<TModelo> Obtener(Expression<Func<TModelo, bool>> filtro)
    {
        throw new NotImplementedException();
    }

}
 