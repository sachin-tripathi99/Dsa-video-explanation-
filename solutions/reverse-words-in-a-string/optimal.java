class Solution {
    public String reverseWords(String s) {
        char[] a = s.toCharArray();
        int n = compact(a);                   // single spaces, none at the ends
        reverse(a, 0, n - 1);                 // reverse everything
        for (int start = 0, i = 0; i <= n; i++) {
            if (i == n || a[i] == ' ') {      // reverse each word back
                reverse(a, start, i - 1);
                start = i + 1;
            }
        }
        return new String(a, 0, n);
    }

    private int compact(char[] a) {
        int w = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i] != ' ') {
                if (w > 0 && a[i - 1] == ' ') a[w++] = ' ';   // one space before a new word
                a[w++] = a[i];
            }
        }
        return w;
    }

    private void reverse(char[] a, int lo, int hi) {
        while (lo < hi) { char t = a[lo]; a[lo++] = a[hi]; a[hi--] = t; }
    }
}
