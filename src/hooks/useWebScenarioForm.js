// hooks/useWebScenarioForm.js
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { webScenarioCategoriesDataGet } from "../RTK/admin/webScenarios/webScenarioCategoriesSlice";
import { useFormik } from "formik";
import { webScenarioEditValidationSchema, webScenarioValidationSchema } from "../utilities/validationSchemas";
import { fetchWebScenario } from "../APIConfig/adminConfig";

export default function useWebScenarioForm(isEdit, id) {
    const dispatch = useDispatch();
    const walkthroughFileRef = useRef(null);
    const thumbnailFileRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            gameName: "",
            category: "",
            severity: "",
            score: "",
            time: "",
            websiteUrl: "",
            flags: "",
            flagChips: [],
            description: "",
            flagInformation: "",
            rulesAndRegulations: "",
            walkthroughFile: null,
            thumbnailFile: null,
            walkthroughUrl: null,
            thumbnailUrl: null,
        },
        validationSchema: isEdit ? webScenarioEditValidationSchema : webScenarioValidationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            // return values to caller via formik.submitForm in parent
        },
    });

    useEffect(() => {
        dispatch(webScenarioCategoriesDataGet());
    }, [dispatch]);

    useEffect(() => {
        if (!isEdit) {
            // already defaulted
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchWebScenario(id);
                const data = response?.data;
                if (data) {
                    formik.setValues({
                        gameName: data?.name || "",
                        category: data?.category_id || "",
                        severity: data?.assigned_severity || "",
                        score: data?.game_points || "",
                        time: data?.time_limit || "",
                        websiteUrl: data?.game_url || "",
                        flags: "",
                        flagChips: data?.flags || [],
                        description: data?.description || "",
                        flagInformation: data?.flag_content_text || "",
                        rulesAndRegulations: data?.rules_regulations_text || "",
                        walkthroughUrl: data?.walkthrough_file_url || null,
                        thumbnailUrl: data?.thumbnail || null,
                        walkthroughFile: null,
                        thumbnailFile: null,
                    });
                }
            } catch (err) {
                console.error("Error fetching scenario", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isEdit, id]);

    return {
        formik,
        walkthroughFileRef,
        thumbnailFileRef,
        loading,
    };
}
