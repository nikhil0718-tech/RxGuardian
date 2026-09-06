from app.services.llm_router import llm_classify


# ============================================================
# TEST CASES
# ============================================================

TEST_CASES = [

    # ========================================================
    # TODAY PRESCRIPTION
    # ========================================================

    (
        "what medicines should I take today?",
        "TODAY_PRESCRIPTION",
        None
    ),

    (
        "what medicine should I take today?",
        "TODAY_PRESCRIPTION",
        None
    ),

    (
        "which medicines should I take today?",
        "TODAY_PRESCRIPTION",
        None
    ),

    (
        "what should I take today?",
        "TODAY_PRESCRIPTION",
        None
    ),

    (
        "what do I need to take today?",
        "TODAY_PRESCRIPTION",
        None
    ),

    (
        "what is sinarest dose in todays medicines?",
        "TODAY_PRESCRIPTION",
        "Sinarest"
    ),

    (
        "what is the dose of sinarest today?",
        "TODAY_PRESCRIPTION",
        "Sinarest"
    ),

    # ========================================================
    # MEDICINE INFORMATION
    # ========================================================

    (
        "what are the uses of dolo 650?",
        "MEDICINE_INFO",
        "Dolo 650"
    ),

    (
        "what is the dosage of dolo 650?",
        "MEDICINE_INFO",
        "Dolo 650"
    ),

    (
        "what are the side effects of dolo 650?",
        "MEDICINE_INFO",
        "Dolo 650"
    ),

    (
        "explain dolo 650",
        "MEDICINE_INFO",
        "Dolo 650"
    ),

    # ========================================================
    # MEDICINE SAFETY
    # ========================================================

    (
        "what precautions should I take with dolo 650?",
        "MEDICINE_SAFETY",
        "Dolo 650"
    ),

    (
        "what happens if I overdose on dolo 650?",
        "MEDICINE_SAFETY",
        "Dolo 650"
    ),

    # ========================================================
    # MEDICINE INTERACTION
    # ========================================================

    (
        "can I take cetirizine with dolo 650?",
        "MEDICINE_INTERACTION",
        ["cetirizine", "Dolo 650"]
    ),

    # ========================================================
    # MISSED DOSE GUIDANCE
    # ========================================================

    (
        "what should I do after missing my medicine?",
        "MISSED_DOSE_GUIDANCE",
        None
    ),

    (
        "should I take the missed dose now?",
        "MISSED_DOSE_GUIDANCE",
        None
    ),

    # ========================================================
    # CURRENT PRESCRIPTION
    # ========================================================

    (
        "show my current prescription",
        "CURRENT_PRESCRIPTION",
        None
    ),

    (
        "what did my doctor prescribe?",
        "CURRENT_PRESCRIPTION",
        None
    ),

    # ========================================================
    # PRESCRIPTION CHECK
    # ========================================================

    (
        "is dolo 650 in my prescription?",
        "PRESCRIPTION_CHECK",
        "Dolo 650"
    ),

    (
        "is combiflam prescribed to me?",
        "PRESCRIPTION_CHECK",
        "Combiflam"
    ),

    # ========================================================
    # PENDING MEDICINES
    # ========================================================

    (
        "what medicines are pending?",
        "PENDING_MEDICINES",
        None
    ),

    (
        "which doses are pending?",
        "PENDING_MEDICINES",
        None
    ),

    # ========================================================
    # MISSED MEDICINES
    # ========================================================

    (
        "what medicines have I missed?",
        "MISSED_MEDICINES",
        None
    ),

    (
        "which doses did I miss?",
        "MISSED_MEDICINES",
        None
    ),

    # ========================================================
    # DUE MEDICINES
    # ========================================================

    (
        "what medicines are due now?",
        "DUE_MEDICINES",
        None
    ),

    (
        "which doses are due?",
        "DUE_MEDICINES",
        None
    ),

    # ========================================================
    # UPCOMING REMINDERS
    # ========================================================

    (
        "show my upcoming reminders",
        "UPCOMING_REMINDERS",
        None
    ),

    (
        "what reminders are coming up?",
        "UPCOMING_REMINDERS",
        None
    ),

    # ========================================================
    # REMINDER STATUS
    # ========================================================

    (
        "what is my reminder status?",
        "REMINDER_STATUS",
        None
    ),

    # ========================================================
    # ADHERENCE
    # ========================================================

    (
        "show my medication adherence",
        "ADHERENCE",
        None
    ),
]


# ============================================================
# MEDICINE MATCHING
# ============================================================

def medicine_matches(
    expected_medicine,
    result
):

    actual_medicine_name = result.get(
        "medicine_name"
    )

    actual_medicine_names = result.get(
        "medicine_names",
        []
    )

    if not isinstance(
        actual_medicine_names,
        list
    ):
        actual_medicine_names = []


    # --------------------------------------------------------
    # No medicine expected
    # --------------------------------------------------------

    if expected_medicine is None:

        return (
            actual_medicine_name is None
            and
            len(actual_medicine_names) == 0
        )


    # --------------------------------------------------------
    # Multiple medicines expected
    # --------------------------------------------------------

    if isinstance(
        expected_medicine,
        list
    ):

        if len(actual_medicine_names) != len(
            expected_medicine
        ):
            return False

        expected = {
            str(name).strip().lower()
            for name in expected_medicine
        }

        actual = {
            str(name).strip().lower()
            for name in actual_medicine_names
        }

        return expected == actual


    # --------------------------------------------------------
    # Single medicine expected
    # --------------------------------------------------------

    if actual_medicine_name is None:

        return False

    return (
        actual_medicine_name
        .strip()
        .lower()
        ==
        str(expected_medicine)
        .strip()
        .lower()
    )


# ============================================================
# DISPLAY MEDICINE
# ============================================================

def get_actual_medicine_display(
    result
):

    medicine_name = result.get(
        "medicine_name"
    )

    medicine_names = result.get(
        "medicine_names",
        []
    )

    if medicine_names:

        return medicine_names

    return medicine_name


# ============================================================
# MAIN TEST
# ============================================================

def main():

    print()
    print("=" * 90)
    print("RxGuardian LLM Router - Comprehensive Test")
    print("=" * 90)

    passed = 0
    failed = 0

    failures = []


    # ========================================================
    # RUN TESTS
    # ========================================================

    for number, (
        query,
        expected_intent,
        expected_medicine
    ) in enumerate(
        TEST_CASES,
        start=1
    ):

        print()
        print("-" * 90)

        try:

            result = llm_classify(
                query
            )

        except Exception as e:

            result = {
                "intent": None,
                "medicine_name": None,
                "medicine_names": []
            }

            print(
                "TEST EXECUTION ERROR:",
                str(e)
            )


        actual_intent = result.get(
            "intent"
        )


        # ----------------------------------------------------
        # Intent comparison
        # ----------------------------------------------------

        intent_match = (
            actual_intent
            ==
            expected_intent
        )


        # ----------------------------------------------------
        # Medicine comparison
        # ----------------------------------------------------

        medicine_match = medicine_matches(
            expected_medicine,
            result
        )


        # ----------------------------------------------------
        # Final result
        # ----------------------------------------------------

        if (
            intent_match
            and
            medicine_match
        ):

            status = "PASS"

            passed += 1

        else:

            status = "FAIL"

            failed += 1

            failures.append({

                "query":
                    query,

                "expected_intent":
                    expected_intent,

                "actual_intent":
                    actual_intent,

                "expected_medicine":
                    expected_medicine,

                "actual_medicine":
                    get_actual_medicine_display(
                        result
                    )

            })


        # ----------------------------------------------------
        # Print result
        # ----------------------------------------------------

        print(
            f"{number:02d}. "
            f"{status:<5} | "
            f"{query}"
        )

        print(
            f"     Expected: "
            f"{expected_intent}"
            f" | "
            f"{expected_medicine}"
        )

        print(
            f"     Actual  : "
            f"{actual_intent}"
            f" | "
            f"{get_actual_medicine_display(result)}"
        )


    # ========================================================
    # SUMMARY
    # ========================================================

    total = len(
        TEST_CASES
    )

    accuracy = (
        passed / total * 100
        if total
        else 0
    )


    print()
    print("=" * 90)
    print("TEST SUMMARY")
    print("=" * 90)

    print(
        f"Total tests : {total}"
    )

    print(
        f"Passed      : {passed}"
    )

    print(
        f"Failed      : {failed}"
    )

    print(
        f"Accuracy    : {accuracy:.2f}%"
    )


    # ========================================================
    # FAILED CASES
    # ========================================================

    if failures:

        print()
        print("=" * 90)
        print("FAILED CASES")
        print("=" * 90)


        for failure in failures:

            print()

            print(
                "Query            :",
                failure[
                    "query"
                ]
            )

            print(
                "Expected intent  :",
                failure[
                    "expected_intent"
                ]
            )

            print(
                "Actual intent    :",
                failure[
                    "actual_intent"
                ]
            )

            print(
                "Expected medicine:",
                failure[
                    "expected_medicine"
                ]
            )

            print(
                "Actual medicine  :",
                failure[
                    "actual_medicine"
                ]
            )


    else:

        print()
        print(
            "✅ ALL ROUTER TESTS PASSED"
        )


    print("=" * 90)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    main()