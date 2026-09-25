class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> rows = new ArrayList<>();
        for (int r = 0; r < numRows; r++) {
            List<Integer> row = new ArrayList<>();
            row.add(1);
            for (int c = 1; c < r; c++) {
                List<Integer> prev = rows.get(r - 1);
                row.add(prev.get(c - 1) + prev.get(c));   // two numbers above
            }
            if (r > 0) row.add(1);
            rows.add(row);
        }
        return rows;
    }
}
