class Solution {
    public String minRemoveToMakeValid(String s) {
        boolean[] del = new boolean[s.length()];
        Deque<Integer> open = new ArrayDeque<>();            // indices of unmatched "("
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') open.push(i);
            else if (c == ')') {
                if (!open.isEmpty()) open.pop();
                else del[i] = true;                          // no partner
            }
        }
        for (int i : open) del[i] = true;                    // never closed
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) if (!del[i]) sb.append(s.charAt(i));
        return sb.toString();
    }
}
