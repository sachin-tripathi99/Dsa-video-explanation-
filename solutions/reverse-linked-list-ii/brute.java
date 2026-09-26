class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        Collections.reverse(vals.subList(left - 1, right));
        int i = 0;
        for (ListNode p = head; p != null; p = p.next) p.val = vals.get(i++);
        return head;
    }
}
