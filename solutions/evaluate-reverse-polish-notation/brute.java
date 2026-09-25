class Solution {
    public int evalRPN(String[] tokens) {
        List<String> t = new ArrayList<>(Arrays.asList(tokens));
        while (t.size() > 1) {
            int i = 0;
            while (!isOp(t.get(i))) i++;                     // first operator
            int a = Integer.parseInt(t.get(i - 2)), b = Integer.parseInt(t.get(i - 1));
            int r = apply(a, b, t.get(i));
            t.subList(i - 2, i + 1).clear();                 // replace a, b, op with the result
            t.add(i - 2, String.valueOf(r));
        }
        return Integer.parseInt(t.get(0));
    }

    private boolean isOp(String s) { return s.length() == 1 && "+-*/".contains(s); }

    private int apply(int a, int b, String op) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            default: return a / b;                           // Java truncates toward zero
        }
    }
}
