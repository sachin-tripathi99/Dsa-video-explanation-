class Solution {
    public int kthGrammar(int n, int k) {
        StringBuilder row = new StringBuilder("0");
        for (int r = 1; r < n; r++) {
            StringBuilder next = new StringBuilder();
            for (int i = 0; i < row.length(); i++) next.append(row.charAt(i) == '0' ? "01" : "10");
            row = next;
        }
        return row.charAt(k - 1) - '0';
    }
}
