class Solution {
    public String decodeString(String s) {
        Deque<StringBuilder> strs = new ArrayDeque<>();
        Deque<Integer> counts = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) k = k * 10 + (c - '0');
            else if (c == '[') {                            // save the outer context
                strs.push(cur);
                counts.push(k);
                cur = new StringBuilder();
                k = 0;
            } else if (c == ']') {                          // combine with the saved context
                StringBuilder prev = strs.pop();
                String inner = cur.toString();
                for (int n = counts.pop(); n > 0; n--) prev.append(inner);
                cur = prev;
            } else cur.append(c);
        }
        return cur.toString();
    }
}
