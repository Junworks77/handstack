namespace HandStack.Core.ExtensionMethod
{
    public static class ListExtensions
    {
        public static bool InsertUnqiue<T>(this IList<T> @this, int index, T item)
        {
            if (@this.Contains(item) == false)
            {
                @this.Insert(index, item);
                return true;
            }
            return false;
        }

        public static int InsertRangeUnique<T>(this IList<T> @this, int startIndex, IEnumerable<T> target)
        {
            var index = startIndex;
            foreach (var item in target)
            {
                if (@this.InsertUnqiue(startIndex, item)) index++;
            }
            return (index - startIndex);
        }

        public static int IndexOf<T>(this IList<T> @this, Func<T, bool> comparison)
        {
            for (var i = 0; i < @this.Count; i++)
            {
                if (comparison(@this[i]) == true)
                {
                    return i;
                }
            }
            return -1;
        }

        public static IList<T>? AddRange<T>(this IList<T> @this, IList<T> itemsToAdd)
        {
            if (@this != null && itemsToAdd != null)
            {
                foreach (T local in itemsToAdd)
                {
                    @this.Add(local);
                }
            }
            return @this;
        }

        public static bool IsNullOrEmpty<T>(IList<T> @this)
        {
            return @this == null || @this.Count<T>() == 0;
        }
    }
}
