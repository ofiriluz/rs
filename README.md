# 3 Days in TLV — Birthday Edition

אתר סטטי קטן שמציג תכנית ל־3 ימים + slots לבחירה ששומרים את ההחלטות ב־LocalStorage.

## הרצה מקומית

אופציה 1 (הכי פשוט):

```bash
python3 -m http.server 5173
```

ואז לפתוח:

- http://localhost:5173

אופציה 2 (אם אין Python):

```bash
npx serve .
```

## עריכת תוכן

כל התוכן נמצא ב־`app.js` בתוך האובייקט `PLAN`:

- ימים / שעות / פעילויות מתוכננות
- slots לבחירה (`type: "choose"`) + רשימת אופציות תחת `choices`

### פתיחה לפי תאריך + שאלת פתיחה

- `startDateISO`: תאריך התחלת היום הראשון (YYYY-MM-DD). אם `null` — היום הראשון יתחיל היום (נוח לדמו).
- לכל יום:
	- `unlock.question`: השאלה לפתיחה
	- `unlock.answers`: תשובות אפשריות (התאמה פשוטה אחרי trim/lowercase)

### תמונות

שים תמונות אישיות בתיקייה `assets/` (ראה `assets/README.md`).

## איפוס בחירות

לחצן "איפוס בחירות" מנקה את ה־LocalStorage עבור האתר.
