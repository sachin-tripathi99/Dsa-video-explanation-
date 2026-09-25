class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> rows = new ArrayList<>();
        for (int r = 0; r < numRows; r++) {
            List<Integer> row = new ArrayList<>();
            for (int c = 0; c <= r; c++) {
                long v = 1;
                for (int k = 1; k <= c; k++) v = v * (r - k + 1) / k;   // C(r, c)
                row.add((int) v);
            }
            rows.add(row);
        }
        return rows;
    }
}
