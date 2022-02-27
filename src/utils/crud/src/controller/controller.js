/**
 *   This Module is responsible for the web
 *   controllers end point
 *   request , response , next  : handling
 *
 *   ( Web Layer )
 *
 *   conrollers are compatible with react-admin
 *
 *  => Controllers with status code if accpeted
 *  --------------------------------------------
 *     getList : 200
 *     create  : 201
 *     getOne  : 200
 *     update  : 202
 *     destroy : 202
 *
 */

//  ============================================================

import { parseQuery, setGetListHeaders } from "./controller.utils";

//  ============================================================

const getList = (ormGetList, ormSearchList, filterOption) => {
    try {
        const { q, limit, offset, filter, order } = parseQuery(
            req.query,
            filterOption
        );

        // ------------------------------------------

        // search query
        if (!q) {
            const { rows, count } = await ormGetList({
                filter,
                limit,
                offset,
                order,
            });

            setGetListHeaders(res, offset, count, rows.length);
            return res.status(200).json(rows);
        }

        // ------------------------------------------

        if (!ormSearchList) {
            return res.status(400).json({
                error: "Search has not implemented yet for this resource",
            });
        }

        // ------------------------------------------

        const { rows, count } = await ormSearchList(q, limit, filter);
        setGetListHeaders(res, offset, count, rows.length);
        res.status(200).json(rows);

        // ------------------------------------------
    } catch (error) {
        next(error);
    }
};
//  ============================================================

const create = (ormCreate) => async (req, res, next) => {
    try {
        const record = await ormCreate(req.body);
        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
};

//  ============================================================

const getOne = (ormGetOne) => async (req, res, next) => {
    try {
        const record = await ormGetOne(req.params.id);

        if (!record) return res.status(404).json({ error: "Record not found" });

        res.status(200).json(record);
    } catch (error) {
        next(error);
    }
};

//  ============================================================

const update = (ormUpdate) => async (req, res, next) => {
    try {
        const record = await ormUpdate(req.body);
        res.status(202).json(record);
    } catch (error) {
        next(error);
    }
};

//  ============================================================

const destroy = (ormDestory) => async (req, res, next) => {
    try {
        await ormDestory(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

//  ============================================================

export default { create, getList, getOne, update, destroy };
