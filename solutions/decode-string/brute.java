class Solution {
    public String decodeString(String s) {
        while (s.indexOf('[') >= 0) {
            int close = s.indexOf(']');                     // first ']' closes an innermost pair
            int open = s.lastIndexOf('[', close);
            int start = open;
            while (start > 0 && Character.isDigit(s.charAt(start - 1))) start--;
            int k = Integer.parseInt(s.substring(start, open));
            s = s.substring(0, start) + s.substring(open + 1, close).repeat(k) + s.substring(close + 1);
        }
        return s;
    }
}
