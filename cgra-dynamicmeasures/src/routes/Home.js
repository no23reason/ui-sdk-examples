import React, { useState } from "react";
import Snowfall from 'react-snowfall'
import { Dashboard, DefaultDashboardInsight } from "@gooddata/sdk-ui-dashboard";
import { idRef } from "@gooddata/sdk-model";

import styles from "./Home.module.scss";

// const DASHBOARD_ID = "aaNEDetXTWPh"; // single insight
const DASHBOARD_ID = "aagCCFA94QP5"; // multiple insights for testing

const Home = () => {
    const CustomInsight = (insight) => {
        const widgetId = insight.widget.identifier;
        const originalBuckets = insight.insight.insight.buckets;
        const originalMeasures = originalBuckets[0].items;
        const [measures, setMeasures] = useState(originalMeasures);

        if (originalBuckets[0].localIdentifier !== 'measures'
            || originalBuckets[0].items.length <= 1) {
            return <DefaultDashboardInsight {...insight} />;
        }

        const newMeasuresBucket = {
            ...originalBuckets[0],
            items: measures
        };
        const newInsight = {
            ...insight,
            insight: {
                ...insight.insight,
                insight: {
                    ...insight.insight.insight,
                    buckets: [
                        newMeasuresBucket,
                        ...[...originalBuckets].splice(1)
                    ]
                }
            }
        };

        return (
            <div className={styles.CustomInsight}>
                <div className={styles.MetricSwitcher}>
                    {originalMeasures.map(defaultMeasure => {
                        const localIdentifier = defaultMeasure.measure.localIdentifier;
                        const isChecked = !!measures.find(m => m.measure.localIdentifier === localIdentifier);

                        return (
                            <label htmlFor={`${widgetId}-${localIdentifier}`}>
                                <input
                                    id={`${widgetId}-${localIdentifier}`}
                                    value={localIdentifier}
                                    type="checkbox"
                                    defaultChecked={isChecked}
                                    disabled={measures.length === 1 && isChecked}
                                    onChange={e => {
                                        if (!e.currentTarget.checked) {
                                            setMeasures(measures.filter(m =>
                                                m.measure.localIdentifier !== localIdentifier))
                                        } else {
                                            setMeasures([...measures, defaultMeasure]);
                                        }
                                    }}
                                />
                                {defaultMeasure.measure.title}
                            </label>
                        );
                    })}
                </div>
                <div className={styles.Insight}>
                    <DefaultDashboardInsight {...newInsight} />
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={styles.Dashboard}>
                <Dashboard
                    dashboard={idRef(DASHBOARD_ID)}
                    InsightComponentProvider={() => CustomInsight}
                />
            </div>
            <Snowfall />
        </>
    );
};

export default Home;
