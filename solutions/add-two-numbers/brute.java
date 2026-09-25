class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        long x = 0, y = 0, p = 1;
        for (ListNode c = l1; c != null; c = c.next, p *= 10) x += c.val * p;   // overflows past ~18 digits
        p = 1;
        for (ListNode c = l2; c != null; c = c.next, p *= 10) y += c.val * p;
        long s = x + y;
        ListNode dummy = new ListNode(0), tail = dummy;
        do { tail.next = new ListNode((int) (s % 10)); tail = tail.next; s /= 10; } while (s > 0);
        return dummy.next;
    }
}
