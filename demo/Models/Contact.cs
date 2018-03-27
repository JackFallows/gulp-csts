namespace MyNamespace
{
    public class Contact<T, U> : Person<T, Thing>
    {
        public string FirstName { get; set; }
    
        public Thing<T> LastName { get; set; }

        public OtherThing<Thing, T> Blah { get; set; }

        public int? Age { get; set; }

        public bool IsActive { get; set; }
    }
}