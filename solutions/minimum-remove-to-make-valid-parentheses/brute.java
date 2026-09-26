class Solution {
    public String minRemoveToMakeValid(String s) {
        Set<String> level = new HashSet<>(List.of(s));
        while (true) {                                       // BFS by number of removals
            for (String t : level) if (valid(t)) return t;
            Set<String> next = new HashSet<>();
            for (String t : level)
                for (int i = 0; i < t.length(); i++)
                    if (t.charAt(i) == '(' || t.charAt(i) == ')') next.add(t.substring(0, i) + t.substring(i + 1));
            level = next;
        }
    }

    private boolean valid(String t) {
        int bal = 0;
        for (char c : t.toCharArray()) {
            if (c == '(') bal++;
            else if (c == ')' && --bal < 0) return false;
        }
        return bal == 0;
    }
}
