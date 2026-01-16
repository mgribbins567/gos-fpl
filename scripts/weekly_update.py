import gspread
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import matplotlib.ticker as ticker
import numpy as np

def save_sheet_as_png(gc, sheet_id, tab_name, cell_range, filename, width, title_pad=20, title=None, color_cols=None, cmap_name='RdYlGn'):
    sh = gc.open_by_key(sheet_id)
    worksheet = sh.worksheet(tab_name)
    data = worksheet.get(cell_range)

    max_cols = max(len(row) for row in data)

    for row in data:
        while len(row) < max_cols:
            row.append("")

    headers = data.pop(0)
    df = pd.DataFrame(data, columns=headers)
    df.columns = df.columns.str.strip()

    for i in range(len(df.columns)):
        col_data = df.iloc[:, i].astype(str)
        clean_data = col_data.astype(str).str.replace(',', '').str.replace('+', '')
        numeric_series = pd.to_numeric(clean_data, errors='coerce')

        if numeric_series.notna().sum() > 0:
            df.iloc[:, i] = numeric_series

    col_widths = []
    for i in range(len(df.columns)):
        col_name = str(df.columns[i])
        col_data = df.iloc[:, i]

        if col_data.empty:
            max_data_len = 0
        else:
            max_data_len = col_data.astype(str).map(len).max()
        
        if pd.isna(max_data_len):
            max_data_len = 0

        max_len = max(max_data_len, len(col_name))

        col_widths.append(max_len * width + 0.01)

    fig_width = sum(col_widths) * 10

    cell_text = []
    for row in df.values:
        clean_row = []
        for val in row:
            if pd.isna(val):
                clean_row.append("")
            elif isinstance(val, (int, float)) and val % 1 == 0:
                clean_row.append(str(int(val)))
            else:
                clean_row.append(str(val))
        cell_text.append(clean_row)

    fig, ax = plt.subplots(figsize=(fig_width,3))

    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)
    ax.set_frame_on(False)

    table = plt.table(cellText=cell_text, colLabels=df.columns, cellLoc='center',loc='center', colWidths=col_widths)

    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1.2,1.2)

    if color_cols:
        cmap = plt.get_cmap(cmap_name)

        for col_idx, col_name in enumerate(df.columns):
            if col_name in color_cols:
                col_values = df.iloc[:, col_idx]

                coerced_vals = pd.to_numeric(col_values, errors='coerce')

                min_val = coerced_vals.min()
                max_val = coerced_vals.max()

                if pd.isna(min_val) or pd.isna(max_val):
                    continue
                    
                if max_val - min_val == 0:
                        norm = lambda x: 0.5
                else:
                    norm = plt.Normalize(vmin=min_val, vmax=max_val)

                for row_idx, val in enumerate(coerced_vals):
                    if pd.isna(val):
                        continue
                    bg_color = cmap(norm(val))
                    cell = table[row_idx + 1, col_idx]
                    cell.set_facecolor(bg_color)
                    cell.set_alpha(0.6)
    
    if "Diff" in df.columns:
        col_idx = df.columns.get_loc("Diff")

        for row_idx, val in enumerate(df["Diff"]):
            if pd.notna(val) and val > 0:
                cell = table[row_idx + 1, col_idx]
                cell.get_text().set_text(f"+{int(val)}")

    if title:
        plt.title(title, fontsize=14, weight='bold', pad=title_pad)

    plt.savefig(filename, bbox_inches='tight', dpi=300)

def save_matchups_as_png(gc, sheet_id, tab_name, cell_range, filename, title=None):
    sh = gc.open_by_key(sheet_id)
    worksheet = sh.worksheet(tab_name)
    data = worksheet.get(cell_range)

    headers = data.pop(0)
    df = pd.DataFrame(data, columns=headers)

    df = df.iloc[:, :4]

    df.columns = ["Manager_A", "Score_A", "Score_B", "Manager_B"]

    df["Score_A"] = df["Score_A"].astype(str)
    df["Score_A"] = pd.to_numeric(df["Score_A"], errors='coerce')
    df["Score_B"] = df["Score_B"].astype(str)
    df["Score_B"] = pd.to_numeric(df["Score_B"], errors='coerce')

    col_widths = [0.3, 0.1, 0.1, 0.3]

    fig_width = 8
    fig_height = (len(df) * 0.5) + 1

    fig, ax = plt.subplots(figsize=(fig_width, fig_height))
    ax.axis('off')

    table = plt.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center', colWidths=col_widths)

    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 1.8)

    winner_color = 'lightgreen'
    loser_color = 'lightcoral'
    draw_color = 'khaki'

    for row_idx in range(len(df)):
        score_a = df.iloc[row_idx, 1]
        score_b = df.iloc[row_idx, 2]

        if pd.isna(score_a) or pd.isna(score_b):
            color_a = 'white'
            color_b = 'white'
        elif score_a > score_b:
            color_a = winner_color
            color_b = loser_color
        elif score_b > score_a:
            color_b = winner_color
            color_a = loser_color
        else:
            color_a = draw_color
            color_b = draw_color

        table[row_idx + 1, 0].set_facecolor(color_a)
        table[row_idx + 1, 1].set_facecolor(color_a)

        table[row_idx + 1, 2].set_facecolor(color_b)
        table[row_idx + 1, 3].set_facecolor(color_b)

        table[row_idx + 1, 1].get_text().set_weight('bold')
        table[row_idx + 1, 2].get_text().set_weight('bold')
    
    if title:
        plt.title(title, fontsize=14, weight='bold', pad=20)

    plt.savefig(filename, bbox_inches='tight', dpi=300)

def save_chart_as_png(gc, sheet_id, tab_name, cell_range, filename, title=None, color='#37003c'):
    sh = gc.open_by_key(sheet_id)
    worksheet = sh.worksheet(tab_name)
    data = worksheet.get(cell_range)

    max_cols = max(len(row) for row in data)
    for row in data:
        while len(row) < max_cols:
            row.append("")

    headers = data.pop(0)
    df = pd.DataFrame(data, columns=headers)

    df.set_index(df.columns[0], inplace=True)

    df = df.T

    df.index = pd.to_numeric(df.index, errors='coerce')

    df.sort_index(inplace=True)

    fig, ax = plt.subplots(figsize=(14,8))

    colors = cm.tab20(np.linspace(0, 1, len(df.columns)))

    for i, manager_name in enumerate(df.columns):
        series = df[manager_name].dropna()

        ax.plot(series.index, series.values,
                marker='o',
                markersize=5,
                linewidth=2,
                label=manager_name,
                color=colors[i])
    
    if title: plt.title(title, fontsize=14, weight='bold', pad=20)
    plt.xlabel("Gameweek", fontsize=10)

    plt.grid(True, linestyle='--', alpha=0.3)

    ax.xaxis.set_major_locator(ticker.MaxNLocator(integer=True))

    plt.legend(bbox_to_anchor=(1.02, 1), loc='upper left', borderaxespad=0, title="Managers")

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    plt.savefig(filename, dpi=300)





def save_league_pngs(sheet_id, filename_base):
    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Table",
        cell_range="B3:Q15",
        filename=filename_base + "/league-table.png",
        width=0.01,
        title="League Table",
        color_cols=None,
        cmap_name=""
    )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Table",
        cell_range="A19:M31",
        filename=filename_base + "/performance-table.png",
        width=0.015,
        title="Performance Table",
        color_cols=["Diff"],
        cmap_name="RdYlGn"
    )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Table",
        cell_range="A35:M47",
        filename=filename_base + "/luck-table.png",
        width=0.015,
        title="Luck Table",
        color_cols=["Diff"],
        cmap_name="RdYlGn"
    )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Table",
        cell_range="B52:L64",
        filename=filename_base + "/form-table.png",
        width=0.02,
        title="Form Table",
        color_cols=None,
        cmap_name=""
    )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Table",
        cell_range="B68:L80",
        filename=filename_base + "/xp-table.png",
        width=0.015,
        title="xP Table",
        color_cols=None,
        cmap_name=""
    )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Table",
        cell_range="B84:K96",
        filename=filename_base + "/am-table.png",
        width=0.015,
        title="All Manager Table",
        color_cols=None,
        cmap_name=""
    )

    # CHANGE THIS ONE AT THE START OF EACH MONTH
    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Manager of the Month",
        cell_range="B83:L95",
        filename=filename_base + "/manager-of-the-month.png",
        width=0.015,
        title="January MotM",
        color_cols=None,
        cmap_name=""
    )

    # CHANGE THIS ONE AT THE START OF EACH WEEK
    # save_matchups_as_png(
    #     gc=gc,
    #     sheet_id=sheet_id,
    #     tab_name="Gameweeks",
    #     cell_range="B122:E127",
    #     filename=filename_base + "/gameweek.png",
    # )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Gameweek Breakdown",
        cell_range="B2:AP16",
        filename=filename_base + "/gameweek-breakdown.png",
        width=0.01,
        title_pad=40,
        title="Gameweek Breakdown",
        color_cols=None,
        cmap_name=""
    )

    save_sheet_as_png(
        gc=gc,
        sheet_id=sheet_id,
        tab_name="Manager Breakdown",
        cell_range="B2:N19",
        filename=filename_base + "/manager-breakdown.png",
        width=0.01,
        title_pad=60,
        title="Manager Breakdown",
        color_cols=None,
        cmap_name=""
    )

    # save_chart_as_png(
    #     gc=gc,
    #     sheet_id=sheet_id,
    #     tab_name="Timelines",
    #     cell_range="A17:AM29",
    #     filename=filename_base + "/points-for-timeline.png",
    #     title="Points For Timeline"
    # )


if __name__ == "__main__":
    gc = gspread.service_account(filename='game-of-stones-466323-5ab3af9d2d71.json')
    SHEET_ID_A = "1AAGP--ACojOQXlIkQUMz87-stYaw_wJo0GFYo7J3zDM"
    SHEET_ID_B = "1cY7Ub90e3siAfp0lE9-gYcHVkUVHwkk7cXNWLWAjFpo"
    SHEET_ID_COMBINED = "1e-zqcbUTEf9mRVj8flpwe4YHfn3B8BQRbjqoc1idscA"

    gameweek = "22"

    save_league_pngs(SHEET_ID_A, "../public/images/season-4/season-4-a-wu/" + gameweek)
    save_league_pngs(SHEET_ID_B, "../public/images/season-4/season-4-b-wu/" + gameweek)

    print("Done")



    